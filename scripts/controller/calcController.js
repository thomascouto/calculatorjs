class CalcController {
  #locale = "pt-BR";
  #displayCalc = document.querySelector("#display");
  #currentDate = document.querySelector("#data");
  #currentTime = document.querySelector("#hora");

  #tempValue = "";
  #operatorValue = "";
  #isOperatorUsed = false;
  #resetNeeded = false;
  #isLastKeyEqual = false;
  #lastOperation = [];

  constructor() {
    this.#displayCalc.innerHTML = "0";
    this.setDateTime();

    /**
     * let myInterval = setInterval()...
     * This may be user to stop interval...
     */
    setInterval(() => {
      this.setDateTime();
    }, 1000);

    let buttons = document.querySelectorAll("#buttons > g, #parts > g");
    buttons.forEach((b, index) => {
      this.addEventListenerAll(b, "click drag", () => {
        let textButton = b.className.baseVal.replace("btn-", "");
        this.execButton(textButton);
      });

      this.addEventListenerAll(b, "mouseover mouseup mousedown", () => {
        b.style.cursor = "pointer";
      });
    });
  }

  /**
   * Reinicia os parametros, utilizado após o uso do `=`
   */
  resetParams() {
    this.#tempValue = "";
    this.#operatorValue = "";
    this.#isOperatorUsed = false;
    this.#resetNeeded = false;
    this.#isLastKeyEqual = false;
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach((event) => {
      // event: "click", "drag", etc...
      // FN é a função que vai executar quando o listener for disparado.
      element.addEventListener(event, fn, false);
    });
  }

  /**
   *
   * @param {Executa as funções dos botões da calculadora.} value
   */
  execButton(value) {
    if (value != "igual") {
      this.#isLastKeyEqual = false;
    }
    switch (value) {
      case "ac":
        //reseta tudo!
        this.#displayCalc.innerHTML = "0";
        this.resetParams();
        break;
      case "ce":
        this.#displayCalc.innerHTML = "0";
        break;
      case "soma":
        this.doOperatorOperation("+");
        break;
      case "subtracao":
        this.doOperatorOperation("-");
        break;
      case "divisao":
        this.doOperatorOperation("/");
        break;
      case "multiplicacao":
        this.doOperatorOperation("*");
        break;
      case "porcento":
        this.concatValues("%");
        break;
      case "igual":
        if (this.#isLastKeyEqual) {
          this.evalOperation(
            this.#displayCalc.innerHTML,
            this.#lastOperation[0],
            this.#lastOperation[1]
          );
        } else {
          this.evalOperation(
            this.#tempValue,
            this.#displayCalc.innerHTML,
            this.#operatorValue
          );
        }
        break;
      case "ponto":
        if (!this.#displayCalc.innerHTML.includes(".")) {
          this.doNumberOperation(".");
        }
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.doNumberOperation(value);
        break;
    }
  }

  /**
   *
   * @param {Valor digitado} value
   */
  doNumberOperation(value) {
    if (this.#isOperatorUsed && this.#resetNeeded) {
      //Utilizou algum operador e após digitou algum número.
      //limpar o display e informar os novos números na tela.
      //armazena o valor anterior antes de atualizar o display.
      this.#tempValue = this.getDisplayCalc();
    }
    this.setDisplayCalc(value);
  }

  /**
   *
   * @param {Parametro será o operador usado} value
   */
  doOperatorOperation(value) {
    this.#isOperatorUsed = true;
    this.#resetNeeded = true;
    this.#operatorValue = value;
  }

  setDateTime() {
    this.#currentDate.innerHTML = new Date().toLocaleDateString(this.#locale, {
      day: "numeric",
      month: "numeric",
      year: "2-digit",
    });

    this.#currentTime.innerHTML = new Date().toLocaleTimeString(this.#locale);
  }

  getDisplayCalc() {
    return this.#displayCalc.innerHTML;
  }

  getCurrentDate() {
    return this.#currentDate;
  }

  getCurrentTime() {
    return this.#currentTime;
  }

  evalOperation(tempValue, displayValue, operation) {
    //se tiver % no primeiro operador, realizar logo a conversão para decimal.
    if (tempValue.includes("%")) {
      //remove o %
      tempValue = tempValue.substring(0, tempValue.length - 1);
      tempValue = parseFloat(tempValue, 10) / 100;
    } else {
      tempValue = parseFloat(tempValue, 10);
    }

    //segundo parametro da operação
    if (displayValue.includes("%")) {
      //remove o % e converte em float.
      displayValue =
        parseFloat(displayValue.substring(0, displayValue.length - 1), 10) /
        100;

      if (operation == "+") {
        displayValue += 1;
        operation = "*";
      } else if (operation == "-") {
        displayValue = 1 - displayValue;
        operation = "*";
      }
    } else {
      displayValue = parseFloat(displayValue, 10);
    }

    console.log(`tempValue: ${tempValue}
    displayValue ${displayValue}
    operation ${operation}`);

    let ops = {
      "+": () => {
        return tempValue + displayValue;
      },
      "-": () => {
        return tempValue - displayValue;
      },
      "*": () => {
        return tempValue * displayValue;
      },
      "/": () => {
        return tempValue / displayValue;
      },
    };

    this.#displayCalc.innerHTML = ops[operation](tempValue, displayValue);
    this.#tempValue = this.#displayCalc.innerHTML;
    if (!this.#isLastKeyEqual) {
      this.#isLastKeyEqual = true;
      this.#lastOperation = [];
      this.#lastOperation.push(displayValue, operation);
    }
  }

  setDisplayCalc(displayCalc) {
    if (this.#resetNeeded) {
      this.#displayCalc.innerHTML = displayCalc;
      this.#resetNeeded = false;
    } else if (this.#displayCalc.innerHTML.length < 10) {
      if (this.#displayCalc.innerHTML == "0") {
        if (displayCalc == ".") {
          this.#displayCalc.innerHTML = "0.";
        } else {
          this.#displayCalc.innerHTML = displayCalc;
        }
      } else {
        this.concatValues(displayCalc);
      }
    }
  }

  /**
   *
   * @param {Valor a ser concatenado ao display} value
   */
  concatValues(value) {
    let newDisplay = this.getDisplayCalc().concat(value);
    this.#displayCalc.innerHTML = newDisplay;
  }
}
