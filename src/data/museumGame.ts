export const roomOrder = ['antiguidades', 'expedicao', 'galeria-real', 'fosseis'] as const
export type RoomId = (typeof roomOrder)[number]

export type MuseumHotspot = {
  id: string
  label: string
  x: number
  y: number
  title: string
  context: string
  problem: string
  answer: number
  unit: string
  clue: string
}

export type MuseumRoomConfig = {
  title: string
  imageAlt: string
  hotspots: MuseumHotspot[]
}

export const museumRooms: Record<RoomId, MuseumRoomConfig> = {
  antiguidades: {
    title: 'Egito Antigo',
    imageAlt: 'Galeria do Egito Antigo com estátuas, sarcófago e hieróglifos.',
    hotspots: [
      {
        id: 'piramide', label: 'Estrutura piramidal', x: 42, y: 51,
        title: 'A pirâmide do faraó',
        context: 'Uma inscrição na estrutura ao lado do sarcófago descreve quatro faces triangulares iguais.',
        problem: 'A base é quadrada, com 6 m de lado, e cada face tem 5 m de altura. Qual é a área das quatro faces triangulares?',
        answer: 60, unit: 'm²', clue: 'A peça não saiu pela entrada principal.',
      },
      {
        id: 'recipiente', label: 'Expositor de artefatos', x: 17, y: 63,
        title: 'O recipiente dos artefatos',
        context: 'Perto das vitrines há um recipiente retangular usado para transportar peças da coleção.',
        problem: 'As dimensões são 8 cm × 4 cm × 3 cm. Qual é a área total da superfície desse prisma retangular?',
        answer: 136, unit: 'cm²', clue: 'O recipiente usado na retirada tinha formato de prisma retangular.',
      },
      {
        id: 'hieroglifos', label: 'Inscrição nos hieróglifos', x: 69, y: 29,
        title: 'A inscrição escondida',
        context: 'Entre os hieróglifos, uma anotação marca a base quadrada de um suporte cerimonial.',
        problem: 'Cada lado da base mede 4 m. Qual é o perímetro da base?',
        answer: 16, unit: 'm', clue: 'Uma inscrição confirma a medida da base do recipiente: 60 cm².',
      },
    ],
  },
  expedicao: {
    title: 'Sala Nórdica',
    imageAlt: 'Sala nórdica de madeira com escudos, ferramentas e objetos de expedição.',
    hotspots: [
      {
        id: 'estrutura-naval', label: 'Estrutura naval', x: 57, y: 47,
        title: 'A estrutura da embarcação',
        context: 'Um desenho naval na madeira revela a face triangular de uma peça usada na expedição.',
        problem: 'A face tem base de 6 m e altura de 4 m. Qual é a área dessa face triangular?',
        answer: 12, unit: 'm²', clue: 'A retirada contou com o veículo de serviço do museu.',
      },
      {
        id: 'escudo-runa', label: 'Escudo com runa', x: 17, y: 57,
        title: 'O escudo rúnico',
        context: 'A runa gravada no escudo indica que seu contorno deve ser medido por todos os lados.',
        problem: 'O escudo tem base quadrada com 5 cm de lado. Qual é o perímetro dessa base?',
        answer: 20, unit: 'cm', clue: 'O recipiente da retirada era um prisma retangular.',
      },
      {
        id: 'caixa-madeira', label: 'Caixa de madeira', x: 86, y: 76,
        title: 'A caixa de madeira',
        context: 'Uma caixa de expedição tem o mesmo formato prismático descrito nas pistas do Egito.',
        problem: 'A caixa mede 10 cm × 6 cm × 4 cm. Qual é a área total de sua superfície?',
        answer: 248, unit: 'cm²', clue: 'A área da base do recipiente era de 60 cm².',
      },
    ],
  },
  'galeria-real': {
    title: 'Galeria Real',
    imageAlt: 'Galeria real com uma carruagem em exposição entre colunas e vitrine.',
    hotspots: [
      {
        id: 'carruagem', label: 'Carruagem real', x: 53, y: 55,
        title: 'A base da carruagem',
        context: 'Uma planta encontrada junto à carruagem mostra o retângulo que sustenta a cabine.',
        problem: 'A base mede 8 cm por 5 cm. Qual é o perímetro desse retângulo?',
        answer: 26, unit: 'cm', clue: 'A carruagem não foi usada na retirada; o registro aponta para um veículo de serviço.',
      },
      {
        id: 'vitrine-piramide', label: 'Vitrine em forma de pirâmide', x: 91, y: 66,
        title: 'A vitrine piramidal',
        context: 'A cobertura da vitrine é uma pirâmide de base quadrada com quatro faces triangulares.',
        problem: 'O lado da base mede 10 cm e a altura de cada face triangular é 8 cm. Qual é a área das quatro faces?',
        answer: 160, unit: 'cm²', clue: 'O recipiente não poderia passar pela passagem principal da Galeria Real.',
      },
      {
        id: 'passagem', label: 'Passagem principal', x: 26, y: 42,
        title: 'A passagem da galeria',
        context: 'Marcas no chão permitem comparar o espaço da passagem com o espaço ocupado por uma estrutura.',
        problem: 'A passagem mede 12 m × 5 m. Uma estrutura ocupa 4 m × 3 m. Qual é a área livre da passagem?',
        answer: 48, unit: 'm²', clue: 'O recipiente saiu por uma rota de serviço, sem passar pela entrada principal.',
      },
    ],
  },
  fosseis: {
    title: 'Sala da Pré-História',
    imageAlt: 'Sala de fósseis com esqueleto de dinossauro e vitrines arqueológicas.',
    hotspots: [
      {
        id: 'vitrine-fossil', label: 'Vitrine de fósseis', x: 7, y: 59,
        title: 'A base da vitrine',
        context: 'A etiqueta da vitrine informa as medidas da base do recipiente que passou pela área de serviço.',
        problem: 'A base retangular mede 12 cm × 5 cm. Qual é a área da base?',
        answer: 60, unit: 'cm²', clue: 'A base do recipiente compatível media 60 cm².',
      },
      {
        id: 'corredor', label: 'Corredor lateral', x: 21, y: 50,
        title: 'A folga no corredor',
        context: 'O corredor lateral é mais largo do que a base do recipiente usado para transportar a peça.',
        problem: 'O corredor tem 80 cm de largura e o recipiente ocupa 60 cm. Qual é a folga entre eles?',
        answer: 20, unit: 'cm', clue: 'O recipiente passou pelo corredor com uma folga de 20 cm.',
      },
      {
        id: 'pedestal-dino', label: 'Pedestal do esqueleto', x: 57, y: 53,
        title: 'A pirâmide do pedestal',
        context: 'O pedestal tem uma cobertura em forma de pirâmide quadrangular com quatro faces triangulares iguais.',
        problem: 'A base de cada face mede 10 cm e sua altura é 12 cm. Qual é a área total das quatro faces?',
        answer: 240, unit: 'cm²', clue: 'As pistas das quatro salas estão reunidas. A base de 60 cm² identifica o recipiente compatível.',
      },
    ],
  },
}
