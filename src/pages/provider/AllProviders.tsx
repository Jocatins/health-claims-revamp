import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../services/store/store";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import EmptyState from "../../components/ui/EmptyState";
import FormHeader from "../../components/form/FormHeader";
import ActionMenu from "../../components/ui/ActionMenu";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { fetchProviders } from "../../services/thunks/iProviderThunk";

const AllProviders: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { providers, loading, error } = useSelector((state: RootState) => state.allProviders);

  useEffect(() => {
    dispatch(fetchProviders());
  }, [dispatch]);

  const handleAddProvider = () => {
    navigate("/provider/registration");
  };

  const handleViewProvider = (providerId: string) => {
    navigate(`/providers/${providerId}`);
  };

  const handleEditProvider = (providerId: string) => {
    navigate(`/providers/${providerId}/edit`);
  };

  return (
    <div className="p-6">
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <FormHeader>All Providers</FormHeader>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="bg-green-800 text-white hover:bg-green-900"
              onClick={handleAddProvider}
            >
              + Add New Provider
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-16 text-red-600 text-sm">{error}</div>
      ) : providers.length === 0 ? (
        <EmptyState
          icon={<span>🏥</span>}
          title="No providers found"
          description="Add new providers to get started."
        />
      ) : (
        <div className="bg-white rounded-md shadow-sm p-0 overflow-hidden">
          <Table
            headers={[
              "SN",
              "Hospital Name",
              "Email",
              "Phone Number",
              "Location",
              "License Number",
              "Status",
              "Actions",
            ]}
            rows={providers.map((provider, index) => [
              index + 1,
              provider.hospitalName,
              provider.email,
              provider.phoneNumber,
              provider.geoLocation,
              provider.stateLicenseNumber,
              <span
                key={provider.id}
                className={`px-2 py-1 rounded text-xs ${
                  provider.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {provider.isActive ? "Active" : "Inactive"}
              </span>,
              <ActionMenu
                key={provider.id}
                onView={() => handleViewProvider(provider.id)}
                onEdit={() => handleEditProvider(provider.id)}
              />,
            ])}
          />
        </div>
      )}
    </div>
  );
};

export default AllProviders;