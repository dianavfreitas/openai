import { render, screen } from "@testing-library/react";
import Homepage from "./Home.jsx"

test('image is present', () => {
    render(<Homepage />);
    const iconElement = screen.getByAltText('bolt');
    expect(iconElement).toBeInTheDocument();
  });

test('image is present', () => {
  render(<Homepage/>);
  const iconElement = screen.getByAltText('money');
    expect(iconElement).toBeInTheDocument();
});
  
test('image is present', () => {
  render(<Homepage/>);
  const iconElement = screen.getByAltText('user');
    expect(iconElement).toBeInTheDocument();
});

test('button is present', () => {
  render(<Homepage/>);
  const homeButton = screen.getByText('Begin journey')
  expect(homeButton).toBeInTheDocument();
});