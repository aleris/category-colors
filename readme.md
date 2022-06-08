# Category Colors

A generator for category colors for charts and visualization that uses a simulated annealing algorithm with a cost 
function that is maximizing the differences and accessibility of the colors in the set.

It is based on the article
[How to pick the least wrong colors](https://matthewstrom.com/writing/how-to-pick-the-least-wrong-colors/) by 
[Matthew Ström](https://matthewstrom.com/).

Initially forked from https://github.com/ilikescience/category-colors/ and rewritten in Typescript with a React UI.

The generator is available online at: https://aleris.github.io/category-colors/. 

## Running

- `yarn dev` to start the local server.
- `yarn test` to run the tests.

Below is the original README:

## How to pick the least wrong colors

This is the code to go along with the essay on my website, [How to pick the least wrong colors](https://matthewstrom.com/writing/how-to-pick-the-least-wrong-colors/).

It is a very unskilled implementation of the simulated annealing algorithm in service of creating color palettes for categorical data visualization.

It comes with an MIT License - please use it carefully and respectfully.

### Running

To generate colors, run `node index.js`.

### Modifying

There are a number of variables you can tweak to adjust the results:

`targetColors` is an array of colors which can be any format readable by [chroma.js](https://gka.github.io/chroma.js/) - the algorithm will attempt to find colors that are similar to these.

`energyWeight,` `rangeWeight`, `targetWeight`, `protanopiaWeight`, `deuteranopiaWeight`, and `tritanopiaWeight` can be any floating point number. They adjust the relative impact of each factor in the algorithm's decisionmaking:
- A higher energy weight will result in colors that are more differentiable from each other
- A higher range weight will result in colors that are more uniformly spread through color space
- A higher target weight will result in colors that are closer to the target colors specified with `targetColors`
- A higher protanopia weight will result in colors that are more differentiable to people with protanopia
- A higher deuteranopia weight will result in colors that are more differentiable to people with deuteranopia
- A higher tritanopia weight will result in colors that are more differentiable to people with tritanopia

`temperature` can be any floating point number. It is the starting point temperature of the algorithm - a higher temperature means that early iterations are more likely to be randomly-chosen than optimized.

`coolingRate` can be any floating point number. It is the decrease in temperature at each iteration. A lower cooling rate will result in more iterations.

`cutoff` is the temperature at which the algorithm will stop optimizing and return results. A lower cutoff means more late-stage iterations where improvements are minimal.
