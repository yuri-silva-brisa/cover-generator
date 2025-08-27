figma.showUI(__html__, { width: 240, height: 180 });

figma.ui.onmessage = (msg) => {
  if (msg.type === "generate-cover") {
    console.log("entrou no code");
    const rect = figma.createRectangle();
    rect.resize(100, 100);
    rect.fills = [{ type: "SOLID", color: getRandomColor() }];
    figma.currentPage.appendChild(rect);
  } else if (msg.type === "create-text") {
    const text = figma.createText();
    text.characters = "Olá, React!";
    text.fills = [{ type: "SOLID", color: getRandomColor() }];
    figma.currentPage.appendChild(text);
  }

  figma.closePlugin();
};

function getRandomColor() {
  return { r: Math.random(), g: Math.random(), b: Math.random() };
}
