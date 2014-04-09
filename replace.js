/*
 * replace.js
 *    Copyright 2014 Andrew Smallbone
 *    andrew@rocketnumbernine.com twitter.com/@andrewsmallbone
 *    http://wherethefuckarethereleasenotes.com/
 *    https://github.com/andrewsmallbone/wherethefuckarethereleasenotes
 *
 *    Licensed under the MIT license http://opensource.org/licenses/MIT
 *
 *    replace_all_withclass("classname", { pet: [ "cat", "dog", "{{fish}}"], fish: ["coy", "haddock"] })
 *   would iterate over all HTML elements in the document with class "classname"
 *   replacing all occurrencies of strings in the form "{{key}}" with a random element
 *   from the array that has the key 'key'.  So the following
 *   <div classname="classname">I have a {{pet}}</div>
 *   Might be replaced with one of:
 *   <div classname="classname">I have a dog</div>
 *   <div classname="classname">I have a haddock</div>
*/

// return a random value of the array
// try to repeat value until have used all
var previous = {};
function randomIndex(array) {
    var used = previous[array];
    if (!used) {
        used = previous[array] = [];
    }
    var val;
    do {
        val = Math.floor(Math.random() * (array.length));
    } while (used.length < array.length && used.indexOf(val) != -1);
    used.push(val);
    return array[val];
}

// replaces any occurence of {{key}} in html with their values in values
// will call
var reg = new RegExp("{{([^}]*)}}", "gm");
function replace(html, values, depth) {
    depth = depth || 0;
    if (depth > 10 || !html) {
        return "";
    }
    return html.replace(reg, function (whole, token) {
        var replacement = values[token];
        if (replacement) {
            if (typeof replacement === String) {
                return replace(replacement, values, depth + 1);
            } else if (replacement instanceof Array) {
                return replace(randomIndex(replacement), values, depth + 1);
            } else {
                console.log("unexpected" + whole + " " + token);
            }
        }
        return token;
    });
}

// replace all tokens on any element with class class_name with the values in values
function replace_all_withclass(class_name, values) {
    previous = {};

    Array.prototype.filter.call(document.getElementsByClassName(class_name), function (element) {
        element.innerHTML = replace(element.innerHTML, values);
    });
}
