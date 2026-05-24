import { render } from "@testing-library/react";
import { Button } from "./button";

describe(Button, () => {
  it("renders as native button element when asChild is false", () => {
    render(<Button name="test">Click</Button>);
    expect(document.querySelector("button")).toBeInstanceOf(HTMLButtonElement);
  });
});
