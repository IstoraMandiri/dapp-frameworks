import 'dappsys/token/base.sol';

contract MyToken is DSTokenBase {
    uint public transferred;
    function MyToken(uint supply) DSTokenBase(supply) {}

    function transfer(address to, uint value)
    returns (bool ok){
      transferred += value;
      return super.transfer(to,value);
    }

    function trasnferFrom(address from, address to, uint value)
    returns (bool ok){
        transferred += value;
        return super.transferFrom(from, to, value);
      }
}
