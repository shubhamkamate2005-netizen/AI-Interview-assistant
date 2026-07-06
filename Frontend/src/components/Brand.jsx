import Icon from "./Icon"

export default function Brand({ compact = false }) {
  return <div className="brand"><span className="brand-mark"><Icon name="sparkles" size={19}/></span>{!compact && <span>Career<span>ly</span></span>}</div>
}
