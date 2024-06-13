import { gql } from '@apollo/client';

export const GET_ALL_WORKSPACE = gql`
    query findAllWorkspace{
      allWorkspaces:findAllWorkspace {
        name,
        id
      }
    }
`;
