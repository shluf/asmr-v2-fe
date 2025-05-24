import React, { useState, useEffect } from "react";
import DataTable from "@/Components/partials/DataTable";
import { columnsRT } from "./data/columnsRT";
import { columnsRW } from "./data/columnsRW";
import { columnsWarga } from "./data/columnsWarga";
import { fetchBiodataUserData } from "@/hooks/admin";

const BiodataUser = () => {
    const [dataRT, setDataRT] = useState([]);
    const [dataRW, setDataRW] = useState([]);
    const [dataWarga, setDataWarga] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = () => {
        fetchBiodataUserData(setDataRT, setDataRW, setDataWarga, setLoading);
    }

    const rtColumns = columnsRT(fetchData);
    const rwColumns = columnsRW(fetchData);
    const wargaColumns = columnsWarga(fetchData);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-full p-6">
            <div id="rw-data" >
                <h2 className="font-semibold text-xl mb-4 text-blue-5">
                    Data anggota RW
                </h2>
                <DataTable data={dataRW} columns={rwColumns} pageSize={4} isLoading={loading} />
            </div>

            <div id="rt-data"  className="mt-10">
                <h2  className="font-semibold text-xl mb-4 text-blue-5">
                    Data anggota RT
                </h2>
                <DataTable data={dataRT} columns={rtColumns} pageSize={4} isLoading={loading} />
            </div>

            <div id="warga-data" className="mt-10">
                <h2 className="font-semibold text-xl mb-4 text-blue-5">
                    Data Warga
                </h2>
                <DataTable data={dataWarga} columns={wargaColumns} pageSize={10} isLoading={loading} />
            </div>

        </div>
    );
};

export default BiodataUser;