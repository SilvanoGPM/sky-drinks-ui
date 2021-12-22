import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import endpoints from "src/api/api";
import { LoadingPage } from "src/components/other/LoadingPage";
import routes from "src/routes";
import { showNotification } from "src/utils/showNotification";

type DrinkType = {
  uuid: string;
  volume: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  description: string;
  price: number;
  additional: string;
  additionalList: string[];
  alcoholic: boolean;
};

type Table = {};

type UserType = {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  role: string;
  birthDay: string;
  cpf: string;
};

type RequestType = {
  drinks: DrinkType[];
  createdAt: string;
  updateddAt: string;
  uuid: string;
  user: UserType;
  table?: Table;
};

export function ViewRequest() {
  const params = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requestFound, setRequestFound] = useState<RequestType>(
    {} as RequestType
  );

  const redirect = useCallback(() => {
    const path = location?.state?.path
      ? `/${location.state.path}`
      : routes.HOME;

    navigate(path);
  }, [location, navigate]);

  useEffect(() => {
    async function loadRequest() {
      try {
        const request = await endpoints.findRequestByUUID(params.uuid || "");
        setRequestFound(request);
      } catch (e: any) {
        showNotification({
          type: "warn",
          message: e.message,
        });

        redirect();
      } finally {
        setLoading(false);
      }
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isUUID = uuidRegex.test(params.uuid || "");

    if (!isUUID) {
      showNotification({
        type: "warn",
        message: "Pesquise por um código válido!",
      });

      redirect();
    }

    if (loading && isUUID) {
      loadRequest();
    }

    return () => setLoading(false);
  }, [params, loading, navigate, location, redirect]);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <h1>{requestFound.uuid}</h1>
        </>
      )}
    </div>
  );
}
