import 'dapple/test.sol';
import 'dappsys/token/token_test.sol';
import 'mytoken.sol';

contract MyTokenTest is Test {
    function testEIP20() {
      var token = new MyToken(100);
      assertEq(token.transferred(), 0); // start at 0

      var tester = new TokenTest();
      token.transfer(address(tester), 10);
      assertEq(token.transferred(), 10, "Didn't register trasnfer.");
    }
}