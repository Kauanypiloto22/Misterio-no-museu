import { ArrowRight, Ruler } from 'lucide-react'
import { Link } from 'react-router-dom'
import stolenVaseImage from '../images/vasoRoubado.png'
import { museumCase } from '../data/case'
import { PageHeader } from '../components/Layout'

export default function Case() { return <><PageHeader eyebrow="CASO 01" title={museumCase.title} text="Analise a cena, conheça a peça e siga as evidências até descobrir como o roubo aconteceu."/><section className="hero-card"><div className="hero-copy"><span className="tag">INVESTIGAÇÃO EM ANDAMENTO</span><h2>A peça desapareceu sem deixar sinais de arrombamento.</h2><p>Durante uma exposição especial, o sistema não registrou abertura forçada. Seu objetivo é descobrir qual recipiente poderia esconder a peça e qual suspeito tinha acesso compatível.</p><Link className="primary" to="/museu">Explorar o museu<ArrowRight size={18}/></Link></div><div className="artifact-card"><div className="artifact-visual"><img src={stolenVaseImage} alt="Vaso Cerimonial de Aurora" /></div><span>PEÇA DESAPARECIDA</span><strong>{museumCase.artifact}</strong><div className="dimension-grid"><div><Ruler size={15}/>30 cm</div><div><Ruler size={15}/>20 cm</div><div><Ruler size={15}/>15 cm</div></div></div></section></> }
