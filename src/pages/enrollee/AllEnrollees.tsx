import React, { useEffect, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useProviderContext } from "../../context/useProviderContext";
import type { RootState } from "../../services/store/store";
import type { Enrollee } from "../../types/Enrollee";
import {
  exportEnrolleesReport,
  getEnrollees,
} from "../../services/api/enrolleeApi";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import EmptyState from "../../components/ui/EmptyState";

import FormHeader from "../../components/form/FormHeader";
import ActionMenu from "../../components/ui/ActionMenu";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const AllEnrollees: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProviderId } = useProviderContext(); 
  const userHmoId = useSelector((s: RootState) => s.auth.user?.hmoId);
  const [items, setItems] = useState<Enrollee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!userHmoId) return; // need user HMO id
    setLoading(true);
    setError(null);
    const hasDigit = /\d/.test(search);
    const params: Record<string, unknown> = {
      HMOId: userHmoId,
      PageNumber: pageNumber,
      PageSize: pageSize,
    };
    if (search) {
      if (hasDigit) params.EnrolleeNumber = search;
      else params.EnrolleeName = search;
    }
    getEnrollees(params)
      .then((res) => {
        setItems(res.data || []);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load enrollees")
      )
      .finally(() => setLoading(false));
  }, [userHmoId, search, pageNumber]);

  useEffect(() => {
    load();
  }, [load]);

  const doExport = async (isExcel: boolean) => {
    if (!selectedProviderId) return; // guard
    setExporting(true);
    setExportError(null);
    try {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      const blob = await exportEnrolleesReport({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        isExcel,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `enrollees.${isExcel ? "xlsx" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="bg-white p-4 rounded-md shadow-sm mb-6">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-3">
              <FormHeader>All Enrollees</FormHeader>
              <Button type="submit" size="sm">
                Search
              </Button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={exporting}
                onClick={() => doExport(false)}
              >
                Export
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-green-800 text-white hover:bg-green-900"
                onClick={() => navigate("/enrollee/registration/individual")}
              >
                + Add New Enrollee
              </Button>
            </div>
          </div>

          {exportError && (
            <div className="text-xs text-red-600 mt-2">{exportError}</div>
          )}
        </div>

        {loading ? (
          <LoadingSpinner/>
        ) : error ? (
          <div className="text-center py-16 text-red-600 text-sm">{error}</div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<span>👥</span>}
            title="No enrollees found"
            description="Adjust filters or add new enrollees."
          />
        ) : (
          <div className="bg-white rounded-md shadow-sm p-0 overflow-hidden">
            <Table
              headers={[
                "SN",
                "Enrollee Name",
                "Gender",
                "Enrollee Class",
                "Enrollee Type",
                "Action",
              ]}
              rows={items.map((en, index) => [
                index + 1,
                `${en.firstName} ${en.lastName}`.trim(),
                en.gender,
                en.enrolleeClass?.name || "-",
                en.enrolleeType?.name || "-",
                <ActionMenu
                  key={en.id}
                  onView={() => navigate(`/enrollees/`)}
                  onEdit={() => navigate(`/enrollees/`)}
                />,
              ])}
            />
            <div className="flex justify-between items-center p-4 text-xs text-gray-600">
              <span>
                Showing {(pageNumber - 1) * pageSize + 1}-
                {(pageNumber - 1) * pageSize + items.length}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={items.length < pageSize}
                  onClick={() => setPageNumber((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllEnrollees;
