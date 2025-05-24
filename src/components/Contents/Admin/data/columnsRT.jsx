import { AlertWrapper, showAlert } from "@/Components/partials/Alert";
import { DataField } from "@/Components/partials/dataField";
import PrimaryButton from "@/Components/Atoms/PrimaryButton";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import axios from "axios";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { useState } from "react";

export const columnsRT = (fetchData) => [
    {
        accessorKey: "nama",
        name: "Nama",
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
        accessorKey: "penanggung_jawab_rt",
        name: "Jabatan",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Jabatan
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium text-nowrap">
                    {row.getValue("penanggung_jawab_rt")}
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        name: "Email",
        header: "Email",
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "periode",
        name: "Periode",
        header: () => <div className="text-center">Periode</div>,
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium text-nowrap">
                    {row.getValue("periode")}
                </div>
            );
        },
    },
    {
        accessorKey: "no_rw",
        name: "Penanggung Jawab",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                    className="text-right"
                >
                    Penanggung Jawab
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium text-nowrap">
                    {row.getValue("no_rw")}
                </div>
            );
        },
    },
    {
        accessorKey: "alamat",
        name: "Alamat",
        header: () => <div className="text-right">Alamat</div>,
        cell: ({ row }) => {
            const [show, setShow] = useState(false);
            return (
                <div className="text-right font-medium">
                    <div
                        className={`cursor-pointer ${
                            show ? "" : "line-clamp-3"
                        }`}
                        onClick={() => setShow(!show)}
                    >
                        {row.getValue("alamat")}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "id_rt",
        header: () => null,
        cell: () => null,
        enableHiding: false,
    },
    {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-center">Action</div>,
        cell: ({ row }) => {
            const idRT = row.getValue("id_rt");
            const [formData, setFormData] = useState(() => ({
                [idRT]: {
                    nama: row.getValue("nama"),
                    email: row.getValue("email"),
                    periode: row.getValue("periode"),
                    penanggung_jawab_rt: row.getValue("penanggung_jawab_rt"),
                    alamat: row.getValue("alamat"),
                },
            }));
            const [loading, setLoading] = useState({});
            const [isDialogOpen, setIsDialogOpen] = useState(false);
            const handleInputChange = (e) => {
                const { name, value } = e.target;
                setFormData((prev) => ({
                    ...prev,
                    [idRT]: {
                        ...prev[idRT],
                        [name]: value,
                    },
                }));
            };

            const handleUpdate = async (id_rt, updatedData) => {
                setLoading((prev) => ({ ...prev, [id_rt]: true }));
                try {
                    await axios.put(
                        `/biodatasUser/store-rt/${id_rt}`,
                        updatedData
                    );
                    
                    showAlert({
                        title: "Berhasil!",
                        desc: `Data ${row.getValue("penanggung_jawab_rt")} telah diperbarui  `,
                        message: "Data berhasil diperbarui",
                        success: true,
                        color: "green",
                        onConfirm: () => {
                            fetchData();
                          },
                    });

                    setIsDialogOpen(false);
                    
                } catch (error) {
                    console.error("Error updating RT data:", error);
                    showAlert({
                        title: "Gagal!",
                        desc: "Terjadi kesalahan saat memperbarui data warga",
                        message: "Gagal memperbarui data",
                        success: false,
                        color: "red",
                    });
                } finally {
                    setLoading((prev) => ({ ...prev, [id_rt]: false }));
                }
            };

            const handleDelete = async (id_rt) => {
                setLoading((prev) => ({ ...prev, [id_rt]: true }));
                try {
                    await axios.delete(route('biodataUser.delete.rt', id_rt));

                    showAlert({
                        title: "Berhasil!",
                        desc: "Data RT telah dihapus",
                        message: "Data berhasil dihapus",
                        success: true,
                        color: "green",
                        onConfirm: () => {
                            fetchData();
                          },
                    });
                    
                } catch (error) {
                    console.error("Error menghapus data RT:", error);
                    showAlert({
                        title: "Gagal!",
                        desc: "Terjadi kesalahan saat menghapus data RT",
                        message: "Gagal menghapus data",
                        success: false,
                        color: "red",
                    });
                } finally {
                    setLoading((prev) => ({ ...prev, [id_rt]: false }));
                }
            };

            return (
                <>
                <div className="flex">
                <button
                    type="button"
                    className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-primary-foreground focus:outline-none bg-red rounded-full border border-gray-200 hover:bg-red-600 hover:text-gray-300 focus:z-10 focus:ring-4 focus:ring-gray-100"
                    disabled={loading[idRT]}
                    onClick={() =>
                        handleDelete(idRT)
                    }
                >
                    <Trash2 width={'16px'} height={'16px'} />
                </button>
                <AlertWrapper />
                <div className="text-center">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        [idRT]: {
                                            nama: row.getValue("nama"),
                                            email: row.getValue("email"),
                                            periode: row.getValue("periode"),
                                            penanggung_jawab_rt: row.getValue(
                                                "penanggung_jawab_rt"
                                            ),
                                            alamat: row.getValue("alamat"),
                                        },
                                    })
                                }
                                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-pencil-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                                </svg>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Edit {row.getValue("penanggung_jawab_rt")}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <DataField
                                    label="Nama"
                                    value={formData[idRT]?.nama || ""}
                                    name="nama"
                                    onChange={handleInputChange}
                                />
                                <DataField
                                    label="Email"
                                    value={formData[idRT]?.email || ""}
                                    name="email"
                                    onChange={handleInputChange}
                                />
                                <DataField
                                    label="Periode"
                                    value={formData[idRT]?.periode || ""}
                                    name="periode"
                                    onChange={handleInputChange}
                                />
                                <DataField
                                    label="Penanggung Jawab"
                                    value={
                                        formData[idRT]?.penanggung_jawab_rt ||
                                        ""
                                    }
                                    name="penanggung_jawab_rt"
                                    onChange={handleInputChange}
                                />
                                <DataField
                                    label="Alamat"
                                    value={formData[idRT]?.alamat || ""}
                                    name="alamat"
                                    textarea
                                    onChange={handleInputChange}
                                />
                                <div className="flex gap-2 justify-end items-center w-full">
                                    <PrimaryButton
                                        color="green"
                                        rounded="full"
                                        disabled={loading[idRT]}
                                        onClick={() =>
                                            handleUpdate(idRT, formData[idRT])
                                        }
                                    >
                                        Simpan
                                    </PrimaryButton>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                </div>
                </>
            );
        },
    },
];
