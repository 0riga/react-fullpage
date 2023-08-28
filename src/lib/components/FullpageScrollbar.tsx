import React, { RefObject, useEffect, useRef, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import useMousePressed from '../hooks/useMousePressed';
import useMousePosition from '../hooks/useMousePosition';

type TProps = {
  scrollHeight: number;
  scrollY: number;
  section: RefObject<HTMLDivElement>;
};

function FullpageScrollbar({ scrollHeight, scrollY, section }: TProps) {
  const handler = useRef<HTMLButtonElement>(null);
  const { y: mouseY } = useMousePosition();
  const isMousePressed = useMousePressed(handler);
  const [handlerHeight, setHandlerHeight] = useState<number>(0);
  const [handlerTop, setHandlerTop] = useState<number>(0);
  const { height: windowHeight } = useWindowSize();
  const [pressMouseY, setPressMouseY] = useState<number>(0);
  const [pressScrollY, setPressScrollY] = useState<number>(0);

  useEffect(() => {
    setHandlerTop(
      (100 - (windowHeight / scrollHeight) * 100) *
        (scrollY / (scrollHeight - windowHeight)),
    );
    setHandlerHeight((windowHeight / scrollHeight) * 100);
  }, [windowHeight, scrollHeight, scrollY]);

  useEffect(() => {
    if (isMousePressed) {
      setPressMouseY(mouseY);
      setPressScrollY(scrollY);
    } else {
      window.getSelection()?.removeAllRanges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMousePressed]);

  useEffect(() => {
    if (isMousePressed) {
      const newScrollY =
        ((mouseY - pressMouseY) / windowHeight) * scrollHeight + pressScrollY;

      if (section.current) {
        section.current.scrollTo(0, newScrollY);
      }
    }
  }, [
    mouseY,
    pressMouseY,
    windowHeight,
    scrollHeight,
    pressScrollY,
    isMousePressed,
    section,
  ]);

  return (
    <div
      className="__react_fullpage-scrollbar"
      style={{ height: `${scrollHeight}px` }}
    >
      <div
        className="__react_fullpage-scrollbar-sticker"
        style={{ height: `${windowHeight}px` }}
      >
        <div
          className="__react_fullpage-scrollbar-container"
          style={{ height: `${windowHeight}px` }}
        >
          <button
            type="button"
            ref={handler}
            className={`__react_fullpage-scrollbar-handler ${
              isMousePressed && 'is-pressed'
            }`}
            style={{ top: `${handlerTop}%`, height: `${handlerHeight}%` }}
            data-is-pressed={isMousePressed}
          ></button>
        </div>
      </div>
    </div>
  );
}

export default FullpageScrollbar;
