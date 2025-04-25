import { AlertWrapper, showAlert } from "@/Components/partials/Alert";
import { DataField } from "@/Components/partials/dataField";
import PrimaryButton from "@/Components/PrimaryButton";
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

export const columnsRW = (fetchData) => [
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
        accessorKey: "penanggung_jawab_rw",
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
                    {row.getValue("penanggung_jawab_rw")}
                </div>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="lowercase">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "periode",
        header: () => <div className="text-center">Periode</div>,
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium">
                    {row.getValue("periode")}
                </div>
            );
        },
    },
    {
        accessorKey: "alamat",
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
        accessorKey: "id_rw",
        header: () => null,
        cell: () => null,
        enableHiding: false,
    },
    {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-center">Action</div>,
        cell: ({ row }) => {
            const idRW = row.getValue("id_rw");
            const [formData, setFormData] = useState(() => ({
                [idRW]: {
                    nama: row.getValue("nama"),
                    email: row.getValue("email"),
                    periode: row.getValue("periode"),
                    penanggung_jawab_rw: row.getValue("penanggung_jawab_rw"),
                    alamat: row.getValue("alamat"),
                },
            }));
            const [loading, setLoading] = useState({});
            const [isDialogOpen, setIsDialogOpen] = useState(false);
            const handleInputChange = (e) => {
                const { name, value } = e.target;
                setFormData((prev) => ({
                    ...prev,
                    [idRW]: {
                        ...prev[idRW],
                        [name]: value,
                    },
                }));
            };

            const handleUpdate = async (id_rw, updatedData) => {
                setLoading((prev) => ({ ...prev, [id_rw]: true }));
                try {
                    await axios.put(
                        `/biodatasUser/store-rw/${id_rw}`,
                        updatedData
                    );

                    setIsDialogOpen(false);

                    showAlert({
                        title: "Berhasil!",
                        desc: `Data ${row.getValue("penanggung_jawab_rw")} telah diperbarui  `,
                        message: "Data berhasil diperbarui",
                        success: true,
                        color: "green",
                        onConfirm: () => {
                            fetchData();
                          },
                    });
                } catch (error) {
                    console.error("Error updating RW data:", error);
                    showAlert({
                        title: "Gagal!",
                        desc: "Terjadi kesalahan saat memperbarui data warga",
                        message: "Gagal memperbarui data",
                        success: false,
                        color: "red",
                    });
                } finally {
                    setLoading((prev) => ({ ...prev, [id_rw]: false }));
                }
            };

            const handleDelete = async (id_rw) => {
                setLoading((prev) => ({ ...prev, [id_rw]: true }));
                try {
                    await axios.delete(route('biodataUser.delete.rw', id_rw));

                    showAlert({
                        title: "Berhasil!",
                        desc: "Data RW telah dihapus",
                        message: "Data berhasil dihapus",
                        success: true,
                        color: "green",
                        onConfirm: () => {
                            fetchData();
                          },
                    });
                    
                } catch (error) {
                    console.error("Error menghapus data RW:", error);
                    showAlert({
                        title: "Gagal!",
                        desc: "Terjadi kesalahan saat menghapus data RW",
                        message: "Gagal menghapus data",
                        success: false,
                        color: "red",
                    });
                } finally {
                    setLoading((prev) => ({ ...prev, [id_rw]: false }));
                }
            };

            return (
                <>
                <AlertWrapper />
                <div className="flex">
                <button
                    type="button"
                    className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-primary-foreground focus:outline-none bg-red rounded-full border border-gray-200 hover:bg-red-600 hover:text-gray-300 focus:z-10 focus:ring-4 focus:ring-gray-100"
                    disabled={loading[idRW]}
                    onClick={() =>
                        handleDelete(idRW)
                    }
                >
                    <Trash2 width={'16px'} height={'16px'} />
                </button>
                <div className="text-center">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData({
                                        [idRW]: {
                                            nama: row.getValue("nama"),
                                            email: row.getValue("email"),
                                            periode: row.getValue("periode"),
                                            penanggung_jawab_rw: row.getValue(
                                                "penanggung_jawab_rw"
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
                                    Edit {row.getValue("penanggung_jawab_rw")}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <DataField
                                    label="Nama"
                                    value={formData[idRW]?.nama || ""}
                                    name="nama"
                                    onChange={handleInputChange}
                                />
                                <DataField
                                    label="Email"
                                    value={formData[idRW]?.email || ""}
                                    name="email"
                                    onChange={handleInputChange}
                                />
                                <DataField
                                    label="Periode"
                                    value={formData[idRW]?.periode || ""}
                                    name="periode"
                                    onChange={handleInputChange}
                                />
                                <DataField
                                    label="jabatan"
                                    value={
                                        formData[idRW]?.penanggung_jawab_rw ||
                                        ""
                                    }
                                    name="penanggung_jawab_rw"
                                    onChange={handleInputChange}
                                />
                                <DataField
                                    label="Alamat"
                                    value={formData[idRW]?.alamat || ""}
                                    name="alamat"
                                    textarea
                                    onChange={handleInputChange}
                                />
                                <div className="flex gap-2 justify-end items-center w-full">
                                    <PrimaryButton
                                        color="green"
                                        rounded="full"
                                        disabled={loading[idRW]}
                                        onClick={() =>
                                            handleUpdate(idRW, formData[idRW])
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
