import { Button } from "@/Components/ui/button";
import { ArrowUpDown, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import axios from "axios";
import PrimaryButton from "@/Components/Atoms/PrimaryButton";
import { useState } from "react";
import { DataField } from "@/Components/partials/dataField";
import { AlertWrapper, showAlert } from "@/Components/partials/Alert";

export const columnsWarga = (fetchData) => [
    {
        accessorKey: "nomer_kk",
        name: "Nomor KK",
        header: () => <div className="text-center">Nomor KK</div>,
        cell: ({ row }) => {
            return <div className="text-left font-medium">{row.getValue("nomer_kk")}</div>;
        },
    },
    {
        accessorKey: "nama",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nama")}</div>
        ),
    },
    {
        accessorKey: "jenis_kelamin",
        name: "Jenis Kelamin",
        header: () => <div className="text-center">Jenis Kelamin</div>,
        cell: ({ row }) => {
            return <div className="text-left font-medium">{row.getValue("jenis_kelamin") === "L" ? "Laki-laki" : "Perempuan"}</div>;
        },
    },
    {
        accessorKey: "nik_warga",
        name: "NIK",
        header: () => <div className="text-center">NIK</div>,
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.getValue("nik_warga")}</div>;
        },
    },
    {
        accessorKey: "no_rt",
        name: "RT",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    RT
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center font-medium">{row.getValue("no_rt")}</div>;
        },
    },
    {
        accessorKey: "no_rw",
        name: "RW",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    RW
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-center font-medium">{row.getValue("no_rw")}</div>;
        },
    },
    {
        accessorKey: "phone",
        name: "No Telp",
        header: () => <div className="text-left">Nomor Telp</div>,
        cell: ({ row }) => {
            return <div className="text-right font-medium">{row.getValue("phone")}</div>;
        },
    },
    {
        accessorKey: "approved",
        header: () => null,
        cell: () => null,
        enableHiding: false,
    },
    {
        accessorKey: "tempat_dan_tanggal_lahir",
        header: () => null,
        cell: () => null,
        enableHiding: false,
    },
    {
        accessorKey: "alamat",
        header: () => null,
        cell: () => null,
        enableHiding: false,
    },

    {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-center">Action</div>,
        cell: ({ row }) => {
            const nikWarga = row.getValue("nik_warga");
            const [loading, setLoading] = useState({});

            const handleDisapprove = async (nik_warga) => {
                setLoading((prev) => ({ ...prev, [nik_warga]: true }));
                try {
                    await axios.post(`/approvalRole/disapprove/${nik_warga}`);

                    setLoading((prev) => ({ ...prev, [nik_warga]: false }));

                    showAlert({
                        title: "Berhasil!",
                        desc: "Akun ini telah dinonaktifkan",
                        message: "Akun berhasil dinonaktifkan",
                        success: true,
                        color: "green",
                        onConfirm: () => {
                            fetchData();
                          },
                    });

                } catch (error) {
                    console.error("Error disapproving user:", error);
                    showAlert({
                        title: "Gagal!",
                        desc: "Akun gagal dinonaktifkan",
                        message: "Terjadi kesalahan saat mendisapprove warga",
                        success: false,
                        color: "red",
                    });
                    setLoading((prev) => ({ ...prev, [nik_warga]: false }));
                }
            };

            return (
                <>
                <AlertWrapper />
                <div className="text-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button 
                                className="text-nowrap border border-blue-500 text-blue-500 px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition"
                            >
                                Lihat data
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Data Lengkap Warga</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <DataField label="Nama" value={row.getValue("nama")} />
                                <DataField label="No KK" value={row.getValue("nomer_kk")} />
                                <DataField label="NIK" value={row.getValue("nik_warga")} />
                                <DataField label="RT" value={row.getValue("no_rt")} />
                                <DataField label="RW" value={row.getValue("no_rw")} />
                                <DataField 
                                    label="Status" 
                                    value={row.getValue("approved") === 1 ? "Disetujui" : "Ditolak"} 
                                />
                                <DataField label="Alamat" value={row.getValue("alamat")} />
                                <DataField 
                                    label="Tanggal Lahir" 
                                    value={row.getValue("tempat_dan_tanggal_lahir")} 
                                />
                                <DataField 
                                    label="Jenis Kelamin" 
                                    value={row.getValue("jenis_kelamin") === "L" ? "Laki-Laki" : "Perempuan"} 
                                />
                                <div className="flex gap-2 justify-end items-center w-full">
                                    <PrimaryButton
                                        color="red"
                                        rounded='full'
                                        disabled={loading[nikWarga]}
                                        onClick={() => handleDisapprove(nikWarga)}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Nonaktifkan Akun
                                    </PrimaryButton>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                </>
            );
        },
    },
];
