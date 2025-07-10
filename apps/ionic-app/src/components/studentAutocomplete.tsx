import React from 'react';
import { IonItem } from '@ionic/react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface StudentOptionType {
  inputValue?: string;
  nome: string;
  id?: string; 
}

interface StudentAutocompleteProps {
  selectedStudent: StudentOptionType | null;
  onStudentChange: (student: StudentOptionType | null) => void;
  students: StudentOptionType[];
}

const StudentAutocomplete: React.FC<StudentAutocompleteProps> = ({
  selectedStudent,
  onStudentChange,
  students,
}) => {
  const filter = createFilterOptions<StudentOptionType>();

  const handleChange = (event: any, newValue: string | StudentOptionType | null) => {
    if (typeof newValue === "string") {
      onStudentChange({ nome: newValue });
    } else if (newValue && newValue.inputValue) {
      onStudentChange({ nome: newValue.inputValue });
    } else {
      onStudentChange(newValue);
    }
  };

  return (
    <IonItem className="mb-4 mt-1" color="page-container">
      <div className="w-full">
        <Autocomplete
          value={selectedStudent}
          onChange={handleChange}
          sx={{
            "& .MuiAutocomplete-inputRoot": {
              color: "white",
              backgroundColor: "#333",
              borderRadius: "4px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#666",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#888",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#aaa",
            },
            "& .MuiInputLabel-root": { color: "#ccc" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#fff" },
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some(
              (option) => inputValue === `${option.nome}`
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                nome: `Adicionar "${inputValue}"`,
              });
            }
            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="aluno-autocomplete"
          options={students}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            if (option.inputValue) return option.inputValue;
            return `${option.nome}`;
          }}
          renderOption={(props, option) => (
            <li
              {...props}
              style={{ backgroundColor: "#333", color: "white" }}
            >
              {option.inputValue
                ? option.nome
                : `${option.nome}`}
            </li>
          )}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecione ou digite o nome do aluno"
              variant="outlined"
              sx={{ "& .MuiSvgIcon-root": { color: "white" } }}
            />
          )}
          fullWidth
          componentsProps={{
            popper: {
              sx: {
                "& .MuiAutocomplete-listbox": {
                  backgroundColor: "#333",
                  color: "white",
                  "& li": {
                    "&:hover": { backgroundColor: "#444" },
                    '&[aria-selected="true"]': {
                      backgroundColor: "#555",
                    },
                  },
                },
              },
            },
          }}
        />
      </div>
    </IonItem>
  );
};

export default StudentAutocomplete;

