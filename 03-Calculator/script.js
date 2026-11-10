
const display = document.getElementById("display");

function append(value) {
    if (display.value === "Error") display.value = "0";

    if (display.value === "0" && !isNaN(value))
        display.value = value;
    else
        display.value += value;
}

function clearDisplay() {
    display.value = "0";
}

function deleteNumber() {
    display.value = display.value.slice(0, -1) || "0";
}

function calculate() {
    try {
        let expression = display.value.replace(/%/g, "/100");

        if (!/^[0-9+\-*/.() ]+$/.test(expression))
            throw Error();

        let result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        display.value = Number.isFinite(result)
            ? String(Number(result.toFixed(10)))
            : "Error";

    } catch {
        display.value = "Error";
    }
}
