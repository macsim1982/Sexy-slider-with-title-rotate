import { render } from "lit-html";
import { tplSlider } from "./slider.tpl.js";

const DEFAULT_OPTIONS = {
  items: [],
  current: 0,
  wording: {},
  indicatorSelector: ".indicator",
  titleSelector: ".title",
  column: 1,
};

export class Slider {
  constructor(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.init();
  }

  init() {
    this.options.onGotoIndexClick = this.gotoIndex.bind(this);
    this.options.onGotoNextClick = this.gotoNext.bind(this);
    this.options.onGotoPrevClick = this.gotoPrev.bind(this);
    this.options.onToggleMode = this.toggleMode.bind(this);

    this.gotoIndex(this.options.current);
  }

  clamp(i) {
    return Math.max(0, Math.min(this.options.items.length - 1, i));
  }

  gotoIndex(index) {
    const next = this.clamp(index);

    this.options = {
      ...this.options,
      hasPrev: next - 1 >= 0,
      hasNext: next + 1 <= this.options.items.length - 1,
      direction: next > this.options.current ? "right" : "left",
      current: next,
      wording: {
        ...this.options.wording,
        current: `${next + 1} / ${this.options.items.length}`,
      },
      items: this.options.items.map((item, i) => {
        item.classList = Object.entries({
          before: i < this.clamp(next - 1),
          prev: i === this.clamp(next - 1),
          current: i === this.clamp(next),
          next: i === this.clamp(next + 1),
          after: i > this.clamp(next + 1),
        })
          .filter((i) => i[1])
          .map((i) => i[0]);

        return item;
      }),
      visibleItems: [
        ...this.options.items.filter(
          (item, i) => i >= this.clamp(next - 2) && i <= this.clamp(next + 2)
        ),
      ],
    };

    this.updateIndicators();
    this.updateTitles();
    this.render();
  }

  gotoNext() {
    return this.gotoIndex(this.options.current + 1);
  }

  gotoPrev() {
    return this.gotoIndex(this.options.current - 1);
  }

  toggleMode() {
    this.options.column = !this.options.column;
    this.render();
    this.gotoIndex(this.options.current);
  }

  updateIndicators() {
    const $indicator = document.querySelector(
      DEFAULT_OPTIONS.indicatorSelector
    );

    if ($indicator) {
      const indicatorWidth = $indicator.offsetWidth;
      this.options.indicatorTransform = `--translate-x:${
        this.options.current * indicatorWidth
      }`;
    }
  }

  updateTitles() {
    const $title = [
      ...document.querySelectorAll(DEFAULT_OPTIONS.titleSelector),
    ].find((_, i) => i === this.options.current);

    if ($title) {
      const indicatorWidth = $title.offsetLeft;
      const indicatorHeight = $title.offsetTop;
      const transform = this.options.column
        ? `--translate-y:${indicatorHeight}`
        : `--translate-x:${indicatorWidth}`;
      this.options.titleTransform = transform;
    }
  }

  render() {
    return render(tplSlider(this.options), document.getElementById("app"));
  }
}
