import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: UserService.getAllUsers,
  });

  const { mutate: createUser, isPending: isCreatingUser } = useMutation({
    mutationFn: UserService.createUser,
    onSuccess: () => {
      // Invalider et refetch la liste des utilisateurs
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users,
    isLoadingUsers,
    createUser,
    isCreatingUser,
  };
};
