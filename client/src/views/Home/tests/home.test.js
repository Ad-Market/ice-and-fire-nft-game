/* eslint-disable no-undef */
import {
  wait,
  waitForElement,
  fireEvent,
  cleanup
} from "@testing-library/react";
import moxios from "moxios";
import { createMemoryHistory } from "history";
import React from "react";
import Home from "../HomeContainer";
import { renderWithReduxAndRouter, mockStore } from "../../../utils/testUtils";
const mockCaptionById = jest.fn().mockName("getCaptionById");
const mockClearActiveTags = jest.fn().mockName("clearActiveTags");
const mockClearCaptions = jest.fn().mockName("clearCaptions");

describe("Home Tests", () => {
  let store;
  afterEach(() => {
    cleanup();
    moxios.uninstall();
  });
  beforeEach(() => {
    store = mockStore({
      captions: {
        activeCaptions: [
          {
            id: 1,
            tag: "food",
            caption: "This is my home base oo"
          }
        ]
      },
      tags: {
        activeTags: ["food"]
      }
    });
    moxios.install();
  });
  let history = createMemoryHistory({
    initialEntries: ["/home"]
  });
  it("should load the document to the DOM with an input form", () => {
    const { queryByPlaceholderText } = renderWithReduxAndRouter(
      <Home
        clearActiveTags={mockClearActiveTags}
        clearCaptions={mockClearCaptions}
      />,
      {
        route: "/home",
        initialState: {},
        history: history,
        store
      }
    );
    const searchInput = queryByPlaceholderText("Enter Tags to Search");
    expect(searchInput).not.toBeNull();
  });

  it("should display text when searched captions are empty", () => {
    const { queryByText } = renderWithReduxAndRouter(
      <Home
        clearActiveTags={mockClearActiveTags}
        clearCaptions={mockClearCaptions}
        getCaptionByTagId={mockCaptionById}
      />,
      {
        route: "/home",
        initialState: {},
        history: history,
        store
      }
    );
    const emptyError = queryByText("Please Search Above");
    expect(emptyError).not.toBeNull;
  });

  it("should fire search button when text is entered", async () => {
    const {
      queryByText,
      queryByPlaceholderText,
      queryByTestId
    } = renderWithReduxAndRouter(
      <Home
        clearActiveTags={mockClearActiveTags}
        clearCaptions={mockClearCaptions}
        getCaptionByTagId={store.dispatch(mockCaptionById)}
      />,
      {
        route: "/home",
        initialState: {},
        history: history,
        store
      }
    );
    const searchInput = queryByPlaceholderText("Enter Tags to Search");
    const searchButton = queryByText("Search");

    fireEvent.change(searchInput, {
      target: { value: "food" }
    });
    fireEvent.blur(searchInput);
    fireEvent.click(searchButton);

    const loader = await waitForElement(() => queryByTestId("loader"));
    await wait(() => {
      expect(mockCaptionById).toBeCalled();
      expect(loader).not.toBeNull;
    });
  });

  it("should display tags and captions after search", async () => {
    const {
      queryByText,
      queryByPlaceholderText,
      queryAllByText,
    } = renderWithReduxAndRouter(
      <Home
        clearActiveTags={mockClearActiveTags}
        clearCaptions={mockClearCaptions}
        getCaptionByTagId={store.dispatch(mockCaptionById)}
      />,
      {
        route: "/home",
        initialState: {},
        history: history,
        store
      }
    );
    const searchInput = queryByPlaceholderText("Enter Tags to Search");
    const searchButton = queryByText("Search");
    const captionCard = queryByText("This is my home base oo");
    const tagCard = queryAllByText("food");
    await wait(() => {
      expect(searchInput).not.toBeNull;
      expect(searchButton).not.toBeNull;
      expect(captionCard).not.toBeNull;
      expect(tagCard).not.toBeNull;
    });
  });
});
