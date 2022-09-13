import * as yup from 'yup'

export const inputSchema = yup.object().shape({
    searchField: yup.string().required('Informe uma cidade para pesquisar.')
})