import { Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export const EmptyPage = () => {
  return (
    <>
      <Container
        // onClick={handleAddNew}
        className="w-full min-h-[600px] border-[2px] flex items-center justify-center hover:cursor-pointer hover:text-red-500"
      >
        <p className="text-[40px]">Empty List, pls add todo more</p>
        <AddIcon className="ml-4 rounded-full border-[2px] w-[60px] h-[60px]" />
      </Container>
    </>
  );
};
