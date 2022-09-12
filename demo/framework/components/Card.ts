import {component} from "../../../src";
import {getTheme} from "../theme";
import {Heading} from "./Heading";

type CardInput = {
  title: string;
}

const theme = getTheme();

export default component<CardInput>(function Card({ $, input, children }) {
  const container = $.div({
    style: {
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.boxShadow.md,
      backgroundColor: theme.colors.surface,
    }
  });

  const headingContainer = $.div({
    style: { padding: theme.padding.md }
  });

  const heading = Heading({
    input: {
      tag: "h3",
      removeMargin: true,
    }
  })

  const body = $.div({
    style: { padding: theme.padding.md }
  })

  return container(
    headingContainer(heading(input.title)),
    body(...children)
  );
})