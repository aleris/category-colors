import styles from './Footer.module.scss'


export function Footer() {
    return (
        <footer className={styles.footer}>
            <hr/>

            <h3>About</h3>
            <p>
                This generator is based on the article <a
                href="https://matthewstrom.com/writing/how-to-pick-the-least-wrong-colors/" target="_blank">How to pick
                the least wrong
                colors</a> by <a href="https://matthewstrom.com/" target="_blank">Matthew
                Ström</a> and <a href="https://github.com/ilikescience/category-colors/" target="_blank">its accompanied
                code</a>.
            </p>
            <p>
                It uses a simulated annealing algorithm with a cost function that is maximizing the differences
                and accessibility of the colors in the palette.</p>
            <p>
                This UI was written in React with Typescript and the <a
                href="https://aleris.github.io/category-colors/" target="_blank">code is available on
                GitHub</a>.
            </p>

            <h3>Tips</h3>
            <ul>
                <li>
                    Copy colors from anywhere and paste them, as long as the text contains some colors in hex
                    format, it will work.
                </li>
                <li>
                    For example, copy sets of template colors from <a href="https://color.adobe.com/explore"
                                                                      target="_blank">Adobe
                    Color</a>.
                </li>
                <li>
                    Click on the <em>ADD</em> button next to the optimized colors to add more slots, it can
                    generate a bigger number of colors than the starting template set.
                </li>
                <li>
                    You can click on <em>GENERATE</em> multiple times, the results will be different as the
                    algorithm is based on randomly searching the color space.
                </li>
            </ul>

            <h3>Example Template Colors</h3>
            <p>
                Copy these and then click on <em>PASTE TEMPLATE COLORS</em>, or paste directly in one of the inputs
                above.
            </p>
            <ul>
                <li>
                    <pre><code>#3EC240 #65C590 #AC2444 #B9A263 #AB088D</code></pre>
                </li>
                <li>
                    <pre><code>#1D594E #F2CB05 #F29F05 #F28705 #F23030</code></pre>
                </li>
                <li>
                    <pre><code>#151F30 #103778 #0593A2 #FF7A48 #E3371E</code></pre>
                </li>
            </ul>
        </footer>
    )
}