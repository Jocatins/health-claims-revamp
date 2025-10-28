import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import EmptyState from "../../components/ui/EmptyState";
import FormHeader from "../../components/form/FormHeader";
import ActionMenu from "../../components/ui/ActionMenu";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { fetchCorporateEntities } from "../../services/thunks/corporateThunk";
import type { AppDispatch, RootState } from "../../services/store/store";

const CorporateEnrollees: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { corporates, loading, error } = useSelector((state: RootState) => state.corporate);

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    dispatch(fetchCorporateEntities());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCorporateEntities());
  };

  // SAFE ARRAY HANDLING
  const corporatesArray = Array.isArray(corporates) ? corporates : [];
  const paginated = corporatesArray.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  const totalCount = corporatesArray.length;

  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FormHeader>Corporate Enrollees</FormHeader>
            <Button type="button" size="sm" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="bg-[#DC2626]-800 text-white hover:bg-[#DC2626]-900"
              onClick={() => navigate("/enrollee/registration/corporate")}
            >
              + Add Corporate
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner/>
      ) : error ? (
        <div className="text-center py-16 text-red-600 text-sm">{error}</div>
      ) : totalCount === 0 ? ( 
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
              {(pageNumber - 1) * pageSize + paginated.length} of {totalCount}
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
                disabled={pageNumber * pageSize >= totalCount}
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