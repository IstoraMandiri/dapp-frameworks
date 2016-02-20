contract Example {
          uint val;
          function Example() {
                    val = 0;
          }

          function GetValue() constant returns(uint) {
                    return(val);
          }

          function Increment() {
                    val += 1;
          }
}
