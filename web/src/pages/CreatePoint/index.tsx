import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./styles.css";
import { Link, useHistory } from "react-router-dom";
import { LeafletMouseEvent } from "leaflet";
import { Map, TileLayer, Marker } from "react-leaflet";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../assets/logo.svg";
import api from "../../services/api";
import axios from "axios";
import Dropzone from "../../components/Dropzone";

interface Item {
  id: number;
  title: string;
  img_url: string;
}
interface IBGECityResponse {
  nome: string;
}
interface IBGEUFResponse {
  sigla: string;
}
// interface File {
//   img_url: string;
// }
const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);

  const [ufs, setUfs] = useState<string[]>([]);
  const [citys, setCitys] = useState<string[]>([]);
  const [selectedUf, setSeletedUf] = useState("0");
  const [selectedCity, setSeletedCity] = useState("0");
  const [selectedFile, setSeletedFile] = useState<File>();

  const [posicaoInicial, setPosicaoInicial] = useState<[number, number]>([
    0,
    0,
  ]);
  const [selectedPositon, setSelectedPositon] = useState<[number, number]>([
    0,
    0,
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const history = useHistory();

  //carregar items
  useEffect(() => {
    api.get("items").then((response) => {
      // console.log("items");
      setItems(response.data);
    });
  }, []);
  // carregar ESTADOS
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((res) => {
        const ufInitials = res.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  //CARREGAR CIDADES DE ACORDO COM A UF
  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((res) => {
        const cityNames = res.data.map((city) => city.nome);
        setCitys(cityNames);
      });
  }, [selectedUf]);

  // ver localização atual
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setPosicaoInicial([latitude, longitude]);
      console.log(position);
    });
  }, []);

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSeletedUf(uf);
    console.log(uf);
  }
  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSeletedCity(city);
    console.log(city);
  }
  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPositon([event.latlng.lat, event.latlng.lng]);
    console.log(event.latlng);
    console.log("aaaa");
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log("inouts");
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filterredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filterredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
    // const { name, value } = event.target;
    // setFormData({ ...formData, [name]: value });
    console.log("teste", id);
  }

  //Cadastrar Ponto
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPositon;
    const items = selectedItems;

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));
    if (selectedFile) {
      data.append("img", selectedFile);
    }

    await api.post("points", data);
    history.push("/");
    // alert("Ponto de Coleta Criado!)
    console.log("form pegando", data);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <span>
            <FiArrowLeft />
          </span>
          <strong>Voltar para Home</strong>
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro de <br /> ponto de coleta
        </h1>
        <Dropzone onFile={setSeletedFile} />
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="name"
              id="name"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Email</h2>
          </legend>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleInputChange}
              type="email"
              name="email"
              id="email"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>WhatsApp</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">WhatsApp</label>
            <input
              onChange={handleInputChange}
              type="text"
              name="whatsapp"
              id="whatsapp"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map
            center={[-22.24861406582254, -53.36166792407769]}
            zoom={15}
            onclick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPositon} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                value={selectedUf}
                onChange={handleSelectedUf}
                name="uf"
                id="uf"
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select onChange={handleSelectedCity} name="city" id="city">
                <option value="0">Selecione uma Cidade </option>
                {citys.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione os itens de coleta</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => {
              return (
                <li
                  onClick={() => handleSelectedItem(item.id)}
                  className={selectedItems.includes(item.id) ? "selected" : ""}
                  key={item.id}
                >
                  <img src={item.img_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar Ponto de Coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
