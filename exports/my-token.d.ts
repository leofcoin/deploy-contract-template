import { Token } from '@leofcoin/standards';
export default class MyToken extends Token {
    constructor(name: string, symbol: string, decimals: number, state: any);
    transfer(from: address, to: address, amount: BigNumberish): void;
    setApproval(operator: string, amount: BigNumberish): void;
    mint(to: address, amount: BigNumberish): void;
    grantRole(address: string, role: string): void;
}
