import { html } from "lit-html";
import { repeat } from "lit-html/directives/repeat";

// Define a template
export const tplSlider = ({
  visibleItems,
  items,
  onGotoIndexClick,
  onGotoPrevClick,
  onGotoNextClick,
  onToggleMode,
  indicatorTransform,
  titleTransform,
  direction,
  column,
  hasNext,
  hasPrev,
  wording = {}
}) => {
  return html`
    <div class="navigation">
      <div
        class="click-prev${hasPrev ? "" : " disabled"}"
        @click="${hasPrev ? onGotoPrevClick : null}"
      >
        <
      </div>
      <div class="current" @click="${onToggleMode}">${wording.current}</div>
      <div
        class="click-next${hasNext ? "" : " disabled"}"
        @click="${hasNext ? onGotoNextClick : null}"
      >
        >
      </div>
    </div>

    <div class="indicators">
      <div
        class="indicator"
        style="${indicatorTransform};--length:${items.length}"
      ></div>
    </div>

    <div class="slides">
      ${repeat(
        visibleItems,
        ({ id }) => id,
        ({ img, classList = [] }) => {
          return html`<div
            class="slide slide--${direction} ${classList.join(" ")}"
          >
            <img class="slide-content" src="${img}" />
          </div>`;
        }
      )}
    </div>

    <div class="titles-wrapper">
      <div
        class="titles ${column ? "column" : ""}"
        style="${titleTransform};--length:${items.length}"
      >
        ${repeat(
          items,
          ({ id }) => id,
          ({ title, classList = [] }, i) =>
            html`<div
              class="title ${classList
                .filter((item) => item === "current")
                .join(" ")}"
              @click=${() => onGotoIndexClick(i)}
            >
              ${title}
            </div>`
        )}
      </div>
    </div>
  `;
};
