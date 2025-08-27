import { useState, useEffect, useRef } from "react";

import "./App.css";
// import "./styles.css"; // Tailwind CSS com os tokens do DS

import MonitorIcon from "./assets/monitor.svg";
import SmartphoneIcon from "./assets/smartphone.svg";
import GlobeIcon from "./assets/globe.svg";
import BrisaIcon from "./assets/brisa-icon.svg";

// --- DADOS E CONSTANTES (ALINHADOS AO DS) ---
const STATUS_OPTIONS = [
  { label: "Em andamento", colorToken: "status-info", color: "#0EA5E9" },
  { label: "Não iniciado", colorToken: "status-muted", color: "#6B7280" },
  { label: "Pausado", colorToken: "status-warning", color: "#F59E0B" },
  { label: "Concluído", colorToken: "status-success", color: "#10B981" },
  { label: "Cancelado", colorToken: "status-danger", color: "#EF4444" },
];

const DEVICE_OPTIONS = [
  {
    label: "Web",
    IconComponent: MonitorIcon,
  },
  { label: "Mobile", IconComponent: SmartphoneIcon },
  {
    label: "Multiplataforma",
    IconComponent: GlobeIcon,
  },
];

const DESIGNER_LIST = [
  {
    id: 1,
    name: "Anderson Nâgelo",
    role: "Designer",
    bgColor: "#4A90E2",
    imgUrl: "",
  },
  { id: 2, name: "Bárbara Barreto", role: "Designer", bgColor: "#50E3C2" },
  {
    id: 3,
    name: "Jéter Megaron Monteiro",
    role: "Designer",
    bgColor: "#F5A623",
  },
  { id: 4, name: "Lucas Alves", role: "Designer", bgColor: "#9013FE" },
  { id: 5, name: "Maria Eduarda", role: "Designer", bgColor: "#BD10E0" },
  { id: 6, name: "Ana Carolyne", role: "Designer", bgColor: "#E84F3C" },
];

// --- COMPONENTES BASE (Recriados a partir do DS) ---
const Button = ({ children, onClick, disabled, variant = "primary" }) => {
  const baseClasses =
    "w-full font-regular py-2 px-4 rounded-md transition-colors text-ui-base";
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-700 disabled:bg-neutral-300",
    secondary: "bg-neutral-200 text-neutral-700 hover:bg-neutral-300",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};
const Input = ({
  label,
  value,
  onChange,
  maxLength,
  required,
  placeholder,
}) => (
  <div>
    <label className="block text-ui-sm font-regular text-neutral-700 mb-1">
      {label}
      {required && "*"}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      placeholder={placeholder}
      className="block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 text-ui-base focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
    />
  </div>
);

const Textarea = ({ label, value, onChange, maxLength, rows = 2 }) => (
  <div>
    <label className="block text-ui-sm font-regular text-neutral-700 mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      rows={rows}
      className="block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 text-ui-base focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
    />
  </div>
);

const Select = ({ label, value, onChange, children }) => (
  <div>
    <label className="block text-ui-sm font-regular text-neutral-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 text-ui-base focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
    >
      {children}
    </select>
  </div>
);

// --- COMPONENTE PRINCIPAL DA APP ---
const App = () => {
  const [title, setTitle] = useState("Novo Projeto de Interface");
  const [description, setDescription] = useState(
    "Desenvolvimento de um novo fluxo para o usuário."
  );
  const [team, setTeam] = useState("Time de Produto");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [device, setDevice] = useState(DEVICE_OPTIONS[0]);
  const [selectedDesigners, setSelectedDesigners] = useState([
    DESIGNER_LIST[0],
    DESIGNER_LIST[1],
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDesignerDropdownOpen, setDesignerDropdownOpen] = useState(false);
  const designerDropdownRef = useRef(null);

  // Lógica para fechar o dropdown de designers ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        designerDropdownRef.current &&
        !designerDropdownRef.current.contains(event.target)
      ) {
        setDesignerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [designerDropdownRef]);

  const filteredDesigners = DESIGNER_LIST.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedDesigners.find((sd) => sd.id === d.id)
  );

  const toggleDesigner = (designer) => {
    if (selectedDesigners.find((d) => d.id === designer.id)) {
      setSelectedDesigners(
        selectedDesigners.filter((d) => d.id !== designer.id)
      );
    } else {
      setSelectedDesigners([...selectedDesigners, designer]);
    }
  };

  useEffect(() => {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg.type === "export-result") {
        const blob = new Blob([msg.bytes], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Usa o nome do arquivo enviado pelo code.ts
        link.download = msg.filename || "Capa_Exportada.png";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const onGenerateCover = () => {
    console.log("Gerando PNG...");
    if (!title) return;
    parent.postMessage(
      {
        pluginMessage: {
          type: "generate-cover",
          // Os dados enviados são os mesmos
          data: {
            title,
            description,
            team,
            status,
            device,
            selectedDesigners,
          },
        },
      },
      "*"
    );
  };

  return (
    <div className="p-8 bg-neutral-50 grid grid-cols-5 grid-rows-5 gap-12 h-screen font-[Poppins]">
      <div className="col-span-2 row-span-5">
        <h1 className="text-lg font-bold text-neutral-900 mb-4">
          Gerador de Capas
        </h1>

        {/* ===== INÍCIO DA SEÇÃO DETALHADA ===== */}

        {/* --- Formulário de Configuração --- */}
        <div className="flex-grow overflow-y-auto space-y-4">
          <Input
            label="Título do Projeto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            required
          />
          <Textarea
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={150}
          />
          <Input
            label="Time Responsável"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={status.label}
              onChange={(e) =>
                setStatus(
                  STATUS_OPTIONS.find((s) => s.label === e.target.value)
                )
              }
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <Select
              label="Dispositivo"
              value={device.label}
              onChange={(e) =>
                setDevice(
                  DEVICE_OPTIONS.find((d) => d.label === e.target.value)
                )
              }
            >
              {DEVICE_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Seletor de Designers */}
          <div className="relative" ref={designerDropdownRef}>
            <label className="block text-ui-sm font-regular text-neutral-700 mb-1">
              Designers
            </label>
            <div
              className="mt-1 p-2 border border-neutral-300 rounded-md min-h-[42px] flex flex-wrap gap-2 cursor-pointer"
              onClick={() => setDesignerDropdownOpen(!isDesignerDropdownOpen)}
            >
              {selectedDesigners.length === 0 && (
                <span className="text-neutral-700 opacity-50 px-1 py-1">
                  Selecione...
                </span>
              )}
              {selectedDesigners.map((d) => (
                <span
                  key={d.id}
                  className="flex items-center gap-2 bg-neutral-200 text-neutral-700 text-ui-sm font-regular px-2 py-1 rounded-full"
                >
                  {d.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDesigner(d);
                    }}
                    className="text-neutral-700 opacity-50 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {isDesignerDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-neutral-300 rounded-md shadow-lg max-h-52 overflow-y-auto">
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border-b sticky top-0 text-ui-base focus:outline-none"
                />
                <ul>
                  {filteredDesigners.map((d) => (
                    <li
                      key={d.id}
                      onClick={() => {
                        toggleDesigner(d);
                        setSearchTerm("");
                      }}
                      className="p-2 hover:bg-primary-500/10 cursor-pointer text-ui-base"
                    >
                      {d.name}
                    </li>
                  ))}
                  {filteredDesigners.length === 0 && (
                    <li className="p-2 text-center text-ui-sm text-neutral-700 opacity-50">
                      Nenhum designer encontrado
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ===== FIM DA SEÇÃO DETALHADA ===== */}

        {/* --- Botões de Ação --- */}
        <div className="mt-auto pt-4 flex items-center gap-3">
          <Button onClick={onGenerateCover} disabled={!title} variant="primary">
            Gerar Capa e Exportar PNG
          </Button>
        </div>
      </div>

      {/* --- Seção de Preview --- */}
      <div className="col-span-3 row-span-5 col-start-3">
        <h2 className="text-ui-sm font-semibold text-neutral-700 mb-2">
          Preview em Tempo Real
        </h2>
        <div className="aspect-video w-full rounded-lg shadow-md p-6 flex flex-col relative bg-gradient-to-br from-blue-800 to-sky-600 text-white">
          {/* Status e Device */}
          <div className="absolute top-4 left-4 flex flex-col items-start space-y-2 z-10">
            <span
              className={`px-4 py-1 rounded-full text-ui-sm font-bold`}
              style={{ backgroundColor: status.color }}
            >
              {status.label}
            </span>
            <div className="flex gap-2 items-center">
              <img src={device.IconComponent} alt="" />
              {device.label}
            </div>
          </div>

          {/* Título e Descrição */}
          <div className="flex-grow flex flex-col items-center justify-center text-center -mt-4">
            <h3 className="text-4xl font-bold break-words px-16">
              {title || "Título do Projeto"}
            </h3>
            <p className="text-lg opacity-90 break-words mt-2 px-16">
              {description || "Descrição de apoio"}
            </p>
          </div>

          {/* Logo */}
          <div className="w-24">
            <img className="w-full" src={BrisaIcon} alt="" />
          </div>

          {/* Avatares */}
          <div className="absolute bottom-4 right-6 flex items-center">
            <div className="flex -space-x-2">
              {selectedDesigners.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  title={d.name}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-blue-400"
                  style={{ backgroundColor: d.bgColor }}
                >
                  {d.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
              ))}
              {selectedDesigners.length > 4 && (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-700 text-white font-bold text-sm border-2 border-blue-400">
                  +{selectedDesigners.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
