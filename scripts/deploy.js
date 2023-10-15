import {readFile} from 'fs/promises'
import launchChain from '@leofcoin/launch-chain'
import {formatUnits, parseUnits} from '@leofcoin/utils'
import {createContractMessage, signTransaction} from '@leofcoin/lib'
import MultiWallet from '@leofcoin/multi-wallet'
import addresses from '@leofcoin/addresses'
import prompts from 'prompts'
import Storage from '@leofcoin/storage'
// FULL node
const network = 'leofcoin:peach'
const {chain, endpoints, clients, mode} = await launchChain({network: 'leofcoin:peach', mode: 'remote', ws: [{url: 'wss://ws-remote.leofcoin.org'}]})

const client = clients.ws[0]

const {multiWIF} = await prompts.prompt({
  message: 'enter multiWIF',
  description: 'see export in identity',
  type: 'text',
  name: 'multiWIF'
})

const {password} = await prompts.prompt({
  message: 'enter password',
  type: 'password',
  name: 'password'
})

// local identity for signing (builtin in FULL node)
let wallet = new MultiWallet('leofcoin:peach')
await wallet.import(password, multiWIF)

const signer = await (await wallet.account(1)).external(1)
const deployerAddress = await signer.address

const createMessage = async (src, params = []) => {
  const contract = (await readFile(src)).toString()
  const name = contract.match(/export{([A-Z])\w+|export { ([A-Z])\w+/g)[0].replace(/export {|export{/, '')
  return createContractMessage(deployerAddress, new TextEncoder().encode(contract.toString().replace(/export{([A-Z])\w+ as default}|export { ([A-Z])\w+ as default }/g, `return ${name}`).replace(/\r?\n|\r/g, '')), params)
}

let message = await createMessage('./exports/my-token.js')

let nonce = await client.getNonce(deployerAddress)
nonce += 1

console.log({
  deployerAddress,
  nonce
});

let root = `.${network}`
const parts = network.split(':')
if (parts[1]) root = `.${parts[0]}/${parts[1]}`

const contractStore = new Storage('contract', root)
await contractStore.init()

try {
  await contractStore.put(await message.hash(), message.encoded)
} catch (error) {
  throw error
}
let transaction = {
  from: deployerAddress,
  to: addresses.contractFactory,
  method: 'registerContract',
  params: [await message.hash()],
  nonce,
  timestamp: Date.now()
}
transaction = await signTransaction(transaction, signer)
await client.sendTransaction(transaction)
// transaction = await client.deployContract(contract, transaction)
console.log(transaction);
// transaction = await client.deployContract(signer, contract, constructorParams)


// createContractMessage()

