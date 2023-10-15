import {Token} from '@leofcoin/standards'

export default class MyToken extends Token {
  constructor(name = 'MyToken', symbol = 'MTK', decimals = 18, state) {
    super(name, symbol, decimals, state)
  }
  
  transfer(from: address, to: address, amount: BigNumberish): void {
    super.transfer(from, to, amount) // default behavior
    // do something
  }

  setApproval(operator: string, amount: BigNumberish): void {
    super.setApproval(operator, amount) // default behavior
    // do something
  }

  mint(to: address, amount: BigNumberish): void {
    // ...
  }

  grantRole(address: string, role: string): void {
    // ..
  }
}