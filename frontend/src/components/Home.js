import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API = process.env.REACT_APP_API;

export const Home = () => {
    const [data, setData] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const obtenerDatosGrafica = async () => {
        try {
            const response = await fetch(`${API}/datos_grafica`);
            if (!response.ok) {
                throw new Error("Error al obtener los datos.");
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        obtenerDatosGrafica();
    }, []);

    const filtrarDatosPorFechas = () => {
        if (!startDate || !endDate) return data;

        const filteredData = {};
        for (const fecha in data) {
            if (fecha >= startDate.toISOString() && fecha <= endDate.toISOString()) {
                filteredData[fecha] = data[fecha];
            }
        }
        return filteredData;
    };

    const agruparPorNombreYMes = () => {
        const filteredData = filtrarDatosPorFechas();
        const groupedData = {};

        for (const fecha in filteredData) {
            for (const nombre in filteredData[fecha]) {
                const mes = fecha.slice(0, 7); // Extraer el año y mes (por ejemplo, "2023-07")
                if (!groupedData[nombre]) {
                    groupedData[nombre] = {};
                }
                if (!groupedData[nombre][mes]) {
                    groupedData[nombre][mes] = 0;
                }
                groupedData[nombre][mes] += filteredData[fecha][nombre];
            }
        }

        return groupedData;
    };

    return (
        <div>
            <div>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Fecha de inicio"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Fecha de fin"
                />
            </div>
            <div>
                {data && (
                    <Plot
                        data={Object.keys(agruparPorNombreYMes()).map((nombre) => ({
                            x: Object.keys(agruparPorNombreYMes()[nombre]),
                            y: Object.values(agruparPorNombreYMes()[nombre]),
                            type: "bar",
                            name: nombre,
                        }))}
                        layout={{
                            title: "Incidencias por Fecha y Modelo",
                            barmode: "group",
                            xaxis: { title: "Mes" },
                            yaxis: { title: "Número de Incidencias" },
                            autosize: true,
                        }}
                        style={{ width: "100%", height: "100%" }}
                    />
                )}
            </div>
        </div>
    );
};
