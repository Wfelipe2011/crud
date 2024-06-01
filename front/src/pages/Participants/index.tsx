import { Button, Input } from "@material-tailwind/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useHttp } from "../../lib";
import { formatCPF, formatPhone } from "../../utils/format";
import { EyeIcon } from "lucide-react";
import toast from "react-hot-toast";
import { UploadImage } from "../../components/CropperImage";

type Participant = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  profile_photo: string;
  profile: string;
  computed: string;
  sex: string;
  group: Group | null;
};

type Group = {
  id: string;
  name: string;
  config_max: number;
  config_min: number;
  config_start_hour: string;
  config_end_hour: string;
  config_weekday: string;
  coordinatorId: string;
};

type Page = {
  total: number;
  current: number;
  next: number | null;
  previous: number | null;
};

interface GetMethodResponse {
  participants: Participant[];
  groups: Group[];
  pages: Page;
}

export function Participants() {
  const http = useHttp();

  const [loading, setLoading] = useState<boolean>(true);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [group, setGroup] = useState<Group[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [page, setPage] = useState<Page>({
    total: 0,
    current: 1,
    next: 0,
    previous: 0,
  });

  const getParticipants = useCallback(
    async (currentPage = page.current) => {
      setLoading(true);
      const { data } = await http.get<GetMethodResponse>("/participants", {
        params: {
          ...(filter && { filter: filter }),
          page: currentPage,
        },
      });
      const { participants, groups, pages } = data;

      setParticipants(participants);
      setPage(pages);
      setGroup(groups);
      setLoading(false);
    },
    [http, filter]
  );

  const debounce = (fn: any, time: number) => {
    let timeout = 0;
    return function (...args: any) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), time);
    };
  };

  const debouncedGetParticipants = useCallback(
    debounce(getParticipants, 2000),
    [getParticipants]
  );

  useEffect(() => {
    debouncedGetParticipants();
  }, [debouncedGetParticipants]);

  useEffect(() => {
    setPage({ ...page, current: 1 });
  }, [filter]);

  const showThisParticipant = (participantSelected: Participant) => {
    if (
      participantSelected.id === participant?.id ||
      participantSelected.computed === participant?.computed
    ) {
      setParticipant({
        id: "",
        name: "",
        cpf: "",
        email: "",
        phone: "",
        profile_photo: "",
        profile: "",
        computed: "",
        group: null,
        sex: "",
      });
      return;
    }
    setParticipant(participantSelected);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-primary-50 w-screen h-screen overflow-hidden">
      <div className="relative flex gap-10 bg-white rounded-md shadow-md shadow-primary-200 p-4 min-w-[80vw] max-w-[90vw] min-h-[80vh] max-h-[90vh]">
        <h1 className="absolute -top-6">Participantes</h1>
        <ListParticipants
          participant={participant}
          participants={participants}
          page={page}
          setPage={setPage}
          loading={loading}
          filter={filter}
          setFilter={setFilter}
          showThisParticipant={showThisParticipant}
          getParticipants={getParticipants}
        />
        <Form
          participant={participant}
          loading={loading}
          setLoading={setLoading}
          setParticipant={setParticipant}
          getParticipants={getParticipants}
          group={group}
        />
      </div>
    </div>
  );
}

interface ListParticipantsProps {
  participant: Participant | null;
  participants: Participant[];
  page: Page;
  setPage: Dispatch<SetStateAction<Page>>;
  loading: boolean;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  showThisParticipant: (p: Participant) => void;
  getParticipants: (page?: number) => void;
}

function ListParticipants({
  participant,
  participants,
  page,
  setPage,
  loading,
  filter,
  setFilter,
  showThisParticipant,
  getParticipants,
}: ListParticipantsProps) {
  if (loading) return <ListParticipantsSkeleton />;

  return (
    <>
      <div className="w-1/2 h-full flex flex-col gap-4">
        <Input
          type="search"
          placeholder="Nome ou Ponto"
          label="Filtrar"
          crossOrigin="true"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          autoFocus
        />
        <div className="flex flex-col gap-4 h-full overflow-y-auto transition-all ease-in-out duration-300">
          <div className="flex gap-2 p-2 bg-gray-50 rounded-md">
            <div className="w-1/12">Foto</div>
            <div className="w-3/12 truncate" title="Nome">
              Nome
            </div>
            <div className="w-4/12 text-center">Telefone</div>
            <div className="w-3/12 text-center">Grupo</div>
            <div className="w-1/12"></div>
          </div>
          {participants?.map((participantInShow) => (
            <div
              className={`flex gap-2 p-2 ${
                participantInShow.id === participant?.id
                  ? "bg-primary-300"
                  : "bg-gray-50"
              } rounded-md`}
            >
              <div className="w-1/12">
                <img
                  src={participantInShow.profile_photo}
                  alt="Foto"
                  className="w-10 rounded-full bg-cover bg-primary-100"
                />
              </div>
              <div
                className="w-3/12 flex items-center truncate"
                title={participantInShow.name}
              >
                {participantInShow.name}
              </div>
              <div className="w-4/12 flex items-center justify-center text-center">
                {formatPhone(participantInShow.phone)}
              </div>
              <div className="w-3/12 flex items-center text-center">
                {participantInShow?.group?.name}
              </div>
              <div className="w-1/12 flex items-center">
                <EyeIcon
                  className="stroke-primary-600 cursor-pointer"
                  onClick={() => showThisParticipant(participantInShow)}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <Button
              className="bg-primary-500"
              disabled={page.current === 1 || loading}
              onClick={() => {
                const newPage = page?.current - 1;
                setPage({ ...page, current: newPage });
                getParticipants(newPage);
              }}
            >
              Anterior
            </Button>
            <p>
              {page.current} de {page.total}
            </p>
            <Button
              className="bg-primary-500"
              disabled={page.current >= page.total || loading}
              onClick={() => {
                const newPage = page?.current + 1;
                setPage({ ...page, current: newPage });
                getParticipants(newPage);
              }}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function ListParticipantsSkeleton() {
  return (
    <div className="w-1/2 h-full flex flex-col gap-4">
      <Input
        type="search"
        placeholder="Nome ou Ponto"
        label="Filtrar"
        crossOrigin="true"
        disabled
      />
      <div className="flex flex-col gap-4 h-full overflow-y-auto transition-all ease-in-out duration-300">
        <div className="flex gap-2 p-2 bg-gray-50 rounded-md">
          <div className="w-1/12">Foto</div>
          <div className="w-3/12 truncate">Nome</div>
          <div className="w-4/12 text-center">Telefone</div>
          <div className="w-3/12 text-center">Grupo</div>
          <div className="w-1/12"></div>
        </div>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
          <div
            key={index}
            className={`flex gap-2 p-2 bg-gray-50 rounded-md h-14`}
          >
            <div
              className={`w-1/12 bg-primary-100 rounded-full animate-pulse delay-[${
                1 * _ + 50
              }ms]`}
            ></div>
            <div
              className={`w-3/12 bg-primary-100 animate-pulse delay-[${
                2 * _ + 100
              }ms]`}
            ></div>
            <div
              className={`w-4/12 bg-primary-100 animate-pulse delay-[${
                3 * _ + 150
              }ms]`}
            ></div>
            <div
              className={`w-3/12 bg-primary-100 animate-pulse delay-[${
                4 * _ + 200
              }ms]`}
            ></div>
            <div
              className={`w-1/12 bg-primary-100 animate-pulse delay-[${
                5 * _ + 250
              }ms]`}
            ></div>
          </div>
        ))}

        <div className="flex justify-between items-center">
          <Button className="bg-primary-500 animate-pulse delay-75" disabled>
            Anterior
          </Button>
          <p>1 de 1</p>
          <Button className="bg-primary-500 animate-pulse delay-200" disabled>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FormProps {
  participant: Participant | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setParticipant: Dispatch<SetStateAction<Participant | null>>;
  getParticipants: () => Promise<void>;
  group: Group[];
}

function Form({
  participant,
  loading,
  setLoading,
  setParticipant,
  getParticipants,
  group,
}: FormProps) {
  const http = useHttp();

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setParticipant({ ...participant, [e.target.name]: e.target.value } as any);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!participant) return;
    setLoading(true);
    try {
      const groupId = participant.group?.id;

      const { group: _, ...participantWithoutGroup } = participant;

      await http.post<Participant>("/participants", {
        ...participantWithoutGroup,
        cpf: participantWithoutGroup.cpf.replace(/\D/g, "").trim(),
        phone: participantWithoutGroup.phone.replace(/\D/g, "").trim(),
        ...(groupId && { groupId }),
      });
      // setParticipant({
      //   id: "",
      //   name: "",
      //   cpf: "",
      //   email: "",
      //   phone: "",
      //   profile_photo: "",
      //   profile: "",
      //   computed: "",
      //   group: {
      //     id: "",
      //     name: "",
      //     config_max: 0,
      //     config_min: 0,
      //     config_start_hour: "",
      //     config_end_hour: "",
      //     config_weekday: "",
      //     coordinatorId: "",
      //   },
      //   sex: "",
      // });
      await getParticipants();
    } catch (error) {
      console.error(error);
      toast.error(
        `Erro ao ${participant.id ? "atualizar" : "adicionar"} participante`
      );
      setLoading(false);
    }
  };

  const updateGroupForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupSelected = group.find((g) => g.id === e.target.value);
    if (!groupSelected) return;
    setParticipant({ ...participant, group: groupSelected } as Participant);
  };

  const updateGenderForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParticipant(
      (old) =>
        ({
          ...old,
          sex: e.target.value,
        } as Participant)
    );
  };

  const updateImage = async (imageRaw: Blob) => {
    const formData = new FormData();
    formData.append("file", imageRaw);
    await http.post<{ url: string }>("/upload/" + participant?.id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const removeImage = () => {
    setParticipant((old) => ({ ...old, profile_photo: "" } as Participant));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-1/2 h-full flex flex-col gap-4"
      >
        <div className="flex justify-between items-center w-full">
          <p>
            {participant?.id ? "Atualizar" : "Adicionar um novo"} participante{" "}
            {participant?.name && `(${participant?.name.trim()})`}
          </p>
          <Button
            type="submit"
            className="bg-primary-500"
            placeholder="Adicionar"
            disabled={loading}
          >
            {participant?.id ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
        <div className="h-full wrap flex-wrap flex space-y-2">
          <div
            className="w-full flex justify-center items-center"
            title={
              participant?.id
                ? "Clique para alterar a imagem"
                : "Imagem do participante não disponível, \nAdicione o participante para depois adicionar uma imagem"
            }
          >
            <UploadImage
              img={participant?.profile_photo}
              handleDeleteImage={removeImage}
              setImage={updateImage}
              className={`${!participant?.id ? "pointer-events-none" : ""}`}
            />
          </div>
          <FormInput
            label="Nome"
            className="w-full"
            name="name"
            value={participant?.name}
            onChange={updateForm}
          />
          <FormInput
            label="Telefone"
            className="w-1/2 pr-2"
            name="phone"
            value={formatPhone(participant?.phone || "")}
            onChange={updateForm}
          />
          <FormInput
            label="CPF"
            className="w-1/2"
            name="cpf"
            value={formatCPF(participant?.cpf || "")}
            onChange={updateForm}
          />
          <FormInput
            label="Email"
            className="w-full"
            name="email"
            type="email"
            value={participant?.email}
            onChange={updateForm}
          />
          <FormSelect
            label="Sexo"
            className="w-1/2 pr-2"
            name="sex"
            value={participant?.sex}
            onChange={updateGenderForm}
            options={[
              { id: "MALE", name: "Masculino" },
              { id: "FEMALE", name: "Feminino" },
            ]}
          />
          <FormSelect
            label="Grupo"
            className="w-1/2"
            name="group"
            value={participant?.group?.id}
            onChange={updateGroupForm}
            options={group}
          />
        </div>
      </form>
    </>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function FormInput({ label, className, ...rest }: FormInputProps) {
  return (
    <div
      className={`flex flex-col gap-1 ${className} transition-all ease-in-out duration-200`}
    >
      <label className="text-sm text-gray-700">{label}</label>
      <input
        {...rest}
        className="border border-gray-400 rounded-md h-10 px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-full"
      />
    </div>
  );
}

interface FormSelectProps<T>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Options<T>[];
}

type Options<T> = {
  id: string;
  name: string;
} & T;

function FormSelect<T = any>({
  label,
  options,
  className,
  ...rest
}: FormSelectProps<T>) {
  return (
    <div
      className={`flex flex-col gap-1 ${className} transition-all ease-in-out duration-200`}
    >
      <label className="text-sm text-gray-700">{label}</label>
      <select
        {...rest}
        className="border border-gray-400 rounded-md h-10 px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-full"
      >
        <option value="">Selecione um grupo</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}