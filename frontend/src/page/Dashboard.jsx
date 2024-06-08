import React from "react";
import { Appbar } from "../components/Navbar";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  Input,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Balance } from "../components/Balance";
import { Buttons } from "../components/Buttons";
import { Users } from "../components/Users";

const Dashboard = () => {
  return (
    <>
    <div className="m-5 ">
    <div>
      <Appbar> </Appbar>

      <div className="">
        <div className="flex mt-5">
          <Typography
            as="a"
            href="#"
            variant="h6"
            className="mr-2 cursor-pointer py-1.5 lg:ml-2"
          >
            Payment App
          </Typography>
        </div>
        
      </div>
    </div>
    
   <Balance value={"10000"}></Balance>
    <Users></Users>
     </div>
</>
  );
};

export default Dashboard;
