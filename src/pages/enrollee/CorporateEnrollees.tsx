import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import EmptyState from "../../components/ui/EmptyState";
import FormHeader from "../../components/form/FormHeader";
import ActionMenu from "../../components/ui/ActionMenu";
import { useCorporates } from "../../hooks/useCorporate";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";


const CorporateEnrollees: React.FC = () => {
  const navigate = useNavigate();
  const { corporates, loading, error, refetch } = useCorporates();

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  // Pagination slice (basic client-side for now)
  const paginated = corporates.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <FormHeader>Corporate Enrollees</FormHeader>
            <Button type="button" size="sm" onClick={refetch}>
              Refresh
            </Button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="bg-green-800 text-white hover:bg-green-900"
              onClick={() => navigate("/enrollee/registration/corporate")}
            >
              + Add Corporate
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        // <div className="text-center py-16 text-sm">Loading corporates...</div>
        <LoadingSpinner/>
      ) : error ? (
        <div className="text-center py-16 text-red-600 text-sm">{error}</div>
      ) : corporates.length === 0 ? (
        <EmptyState
          icon={<span>👥</span>}
          title="No corporates found"
          description="Try refreshing or add a new corporate enrollee."
        />
      ) : (
        <div className="bg-white rounded-md shadow-sm p-0 overflow-hidden">
          <Table
            headers={[
              "SN",
              "Company Name",
              "Corporate Type",
              "Corporate Category",
              "Email",
              "Action",
            ]}
            rows={paginated.map((corp, index) => [
              (pageNumber - 1) * pageSize + index + 1,
              corp.companyName,
              corp.corporateType,
              corp.corporateCatgory,
              corp.email,
              <ActionMenu
                key={corp.id}
                onView={() => navigate(`/corporates/${corp.id}`)}
                onEdit={() => navigate(`/corporates/edit/${corp.id}`)}
              />,
            ])}
          />

          <div className="flex justify-between items-center p-4 text-xs text-gray-600">
            <span>
              Showing {(pageNumber - 1) * pageSize + 1}–
              {(pageNumber - 1) * pageSize + paginated.length} of {corporates.length}
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
                disabled={pageNumber * pageSize >= corporates.length}
                onClick={() => setPageNumber((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateEnrollees;
