export const museumCase = {
  title: 'O Roubo no Museu',
  subtitle: 'Caso 01 · A peça desaparecida',
  artifact: 'Vaso Cerimonial de Aurora',
  dimensions: { length: 30, width: 20, height: 15 },
  volume: 9000,
  clues: [
    'Não houve abertura forçada registrada.',
    'A peça não poderia ser desmontada.',
    'Um objeto grande foi recarregado em um veículo de serviço.',
    'Foram encontrados recipientes em caixas, tubos e armários.',
  ],
}

export const challenges = [
  {
    id: 1,
    title: 'A ficha técnica',
    concept: 'Dimensões e volume',
    prompt: 'A peça mede 30 cm × 20 cm × 15 cm. Qual é o volume mínimo que um recipiente deve comportar?',
    answer: 9000,
    unit: 'cm³',
    hint: 'Para um prisma retangular, multiplique comprimento × largura × altura.',
    explanation: 'V = 30 × 20 × 15 = 9.000 cm³.',
  },
  {
    id: 2,
    title: 'A caixa azul',
    concept: 'Prisma retangular',
    prompt: 'Uma caixa possui 35 cm × 25 cm × 12 cm. Ela comporta a peça? Considere apenas as dimensões internas.',
    answer: 1,
    unit: 'sim',
    hint: 'Compare cada dimensão da caixa com a dimensão correspondente da peça.',
    explanation: '35 ≥ 30, 25 ≥ 20 e 12 < 15. Portanto, a caixa não comporta a peça.',
  },
  {
    id: 3,
    title: 'O tubo de transporte',
    concept: 'Cilindro',
    prompt: 'Um tubo tem raio interno de 10 cm e altura de 40 cm. A peça tem 30 cm na maior dimensão. O tubo pode ser descartado pelo encaixe?',
    answer: 1,
    unit: 'sim',
    hint: 'Um objeto de 30 cm não cabe em um tubo cuja altura é 40 cm se a largura necessária não couber no diâmetro.',
    explanation: 'O diâmetro é 20 cm, menor que os 30 cm necessários. O tubo pode ser descartado.',
  },
  {
    id: 4,
    title: 'O recipiente final',
    concept: 'Área e encaixe',
    prompt: 'O recipiente D tem base de 32 cm × 22 cm e altura interna de 16 cm. Ele atende às três dimensões da peça?',
    answer: 1,
    unit: 'sim',
    hint: 'Compare 32×22×16 com 30×20×15 dimensão por dimensão.',
    explanation: 'As três dimensões internas são maiores que as da peça. O recipiente D é compatível.',
  },
  {
    id: 5,
    title: 'Quem teve acesso?',
    concept: 'Análise de evidências',
    prompt: 'A evidência aponta para o uso de uma área de serviço e de um veículo. Qual hipótese é mais consistente?',
    answer: 2,
    unit: 'suspeito 2',
    hint: 'Não procure apenas quem esteve no museu; procure quem tinha acesso compatível ao método.',
    explanation: 'A hipótese correta é a que combina acesso à área de serviço, veículo e recipiente compatível.',
  },
]

export const suspects = [
  { id: 1, name: 'Helena Duarte', role: 'Restauradora', access: 'Laboratório', compatible: false },
  { id: 2, name: 'Caio Mendes', role: 'Técnico de manutenção', access: 'Área de serviço + veículo', compatible: true },
  { id: 3, name: 'Marina Alves', role: 'Guia da exposição', access: 'Salas de visitação', compatible: false },
  { id: 4, name: 'Otávio Reis', role: 'Segurança', access: 'Salas e monitoramento', compatible: false },
]
