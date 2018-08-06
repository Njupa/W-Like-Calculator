// Rules for proper math algorithms
// Here comes the if/else/switch/case nightmare
// use 'if' statements if there are multiple conditions
function checkRules(input) {
  let strMain = domRef.inputMain.value;
  let lastChar = strMain.charAt(strMain.length - 1);

  if (isNaN(input)) {
    switch (input) {
      case '(':
      // here we check if last character from inputMain.value
      // is a '.'. If true, return false, in any other case,
      // return true, even if lastChar is a number which we'll
      // later translate to [number*(operation)]. Increment
      // parenLeft so we can later check against parenRight.
      // Allow dots.
        switch (lastChar) {
          case '.':
            return false;
            break;
          default:
            if ((!isNaN(lastChar) || lastChar === ')') && strMain.length !== 0) {
              let mult = '*';
              updateInputMain(mult);
              if (ops.parenLeft === ops.parenRight) {
                updateInputSecond();
              }
            }

            ops.parenLeft++;
            ops.dotAllowed = true;
            ops.parenRightAllowed = false;
            return true;
            break;
        }
        break;

      case ')':
        // 1. Is there at least one open parenthesis somewhere in strMain
        // 2. lastChar must be a number or closed parenthesis
        // 3. Finally, check if parenAllowed returns true
        if (ops.parenLeft > ops.parenRight && (!isNaN(lastChar) || lastChar === ')') && ops.parenRightAllowed) {
          ops.parenRight++;
          return true;
        } else {
          return false;
        }
        break;

      case '.':
        switch (isNaN(lastChar) || strMain.length === 0) {      // allow dot only if lastChar is a number, also
          case true:                                            // make sure to allow only one per number
            return false;
            break;
          default:
            switch (ops.dotAllowed) {
              case true:
                ops.dotAllowed = false;
                return true;
                break;
              default:
                return false;
                break;
            }
        }
        break;

      case '-':
        if (!isNaN(lastChar) || lastChar === ')') {
          ops.dotAllowed = true;
          ops.parenRightAllowed = true;
          if (ops.parenLeft === ops.parenRight && strMain.length > 0) {
            ops.inputUpdateAllowed = true;
          }
          return true;
        } else if (lastChar === '(') {
          return true;
        } else {
          return false;
        }
        break;

      case '+':
      // fallthrough
      case '*':
      // fallthrough
      case '/':
        if ((!isNaN(lastChar) || lastChar === ')') && strMain.length > 0) {
          ops.dotAllowed = true;
          ops.parenRightAllowed = true;
          if (ops.parenLeft === ops.parenRight && strMain.length > 0) {
            ops.inputUpdateAllowed = true;
          }
          return true;
        } else {
          return false;
        }
    }

  } else {
    switch (lastChar) {
      case ')':
        let mult = '*';
        updateInputMain(mult);
        break;
      default:
        break;
    }
    return true;
  }
}
