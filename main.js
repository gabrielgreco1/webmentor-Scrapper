import puppeteer from "puppeteer";
import "dotenv/config";

const url = `https://uscs.mentorweb.ws/uscsSecurityG5/?pcaes=a205de9c60d3992e6296830743168a74`;

async function main() {
  const browser = await puppeteer.launch({ headless: 'new'}); // true para rodar em background

  // Abrir uma nova página
  const page = await browser.newPage();

  // Definir a resolução da janela
  await page.setViewport({ width: 1280, height: 1024 });

  // Navegar até o URL especificado
  await page.goto(url);

  let cpf = process.env.cpf
  let senha = process.env.senha

  await page.type("#j_username", cpf);
  await page.type("#senha", senha);
  await page.click("#btnLogin");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.goto(
    "https://uscs.mentorweb.ws/uscsMentorWebG5/jsf/central/cal/notasFaltas.jsf"
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.click(".ui-button-text.ui-c");
  await new Promise((resolve) => setTimeout(resolve, 500));
  await page.click(".ui-button-text.ui-c");
  await new Promise((resolve) => setTimeout(resolve, 500));

  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll(
      "#formPrincipal\\:notasFaltas_data tr"
    );
    let data = {};
    console.log(rows);
    // Itera sobre cada linha da tabela
    for (let row of rows) {
      console.log("oi");

      const discipline = row
        .querySelector(".tamColunaDisciplina label")
        .innerText.trim();
      const grade =
        row
          .querySelector(".TexAlCenter.tamDemaisColunas label")
          .innerText.trim() || "-";
      console.log(grade);
      // Adiciona a disciplina e a nota ao objeto
      data[discipline] = grade;
    }
    return data
  });
  console.log(result)
}

main();
