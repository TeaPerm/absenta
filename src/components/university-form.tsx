import { useState, useRef } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/constants';
import { useAuthStore } from '@/hooks/useAuth';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import universities from '@/lib/universites';
import { UniversityCombobox } from '@/pages/register/university-combobox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const shakeAnimation = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
.shake {
  animation: shake 0.5s;
}
`;

interface UniversityFormProps {
  onClose?: () => void;
}

const UniversityForm = ({ onClose }: UniversityFormProps = {}) => {
  const user = useUser();
  const token = useAuthStore((state) => state.token);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(user?.university || []);
  const [newUniversity, setNewUniversity] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const lastTrashRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const updateUniversitiesMutation = useMutation({
    mutationFn: async (universities: string[]) => {
      const response = await axios.put(`${API_URL}/auth/user/university`, 
        { universities },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Egyetemek sikeresen frissítve!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error('Error updating universities:', error);
      toast.error('Hiba történt az egyetemek frissítése során.');
    }
  });

  const handleSubmit = async () => {
    if (selectedUniversities.length === 0) {
      toast.error('Legalább egy egyetemet ki kell választania!');
      return;
    }
    
    updateUniversitiesMutation.mutate(selectedUniversities);
  };

  const handleAddUniversity = () => {
    if (newUniversity && !selectedUniversities.includes(newUniversity)) {
      const updatedUniversities = [...selectedUniversities, newUniversity];
      setSelectedUniversities(updatedUniversities);
      setNewUniversity('');
      setShowWarning(false);
    }
  };

  const handleRemoveUniversity = (index: number) => {
    if (selectedUniversities.length <= 1) {
      if (lastTrashRef.current) {
        lastTrashRef.current.classList.remove('shake');
        void lastTrashRef.current.offsetWidth;
        lastTrashRef.current.classList.add('shake');
      }
      
      setShowWarning(true);
      
      return;
    }
    
    const updatedUniversities = selectedUniversities.filter((_, i) => i !== index);
    setSelectedUniversities(updatedUniversities);
  };

  return (
    <div className="p-4 space-y-4">
      <style>{shakeAnimation}</style>
      
      <h1 className="text-xl font-bold mb-4">Egyetemek kezelése</h1>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-3 items-end">
          <div>
            <UniversityCombobox 
              field={{ 
                value: newUniversity, 
                onChange: (value: string) => setNewUniversity(value) 
              }} 
            />
          </div>
          <Button 
            type="button"
            onClick={handleAddUniversity}
            disabled={!newUniversity}
            className="mt-auto"
          >
            Hozzáadás
          </Button>
        </div>

        <div className="max-h-[300px] overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 bg-white sticky top-0">#</TableHead>
                <TableHead className="bg-white sticky top-0">Egyetem neve</TableHead>
                <TableHead className="w-16 bg-white sticky top-0"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedUniversities.map((universityCode, index) => {
                const universityName = universities[universityCode]?.name || universityCode;
                const isLast = selectedUniversities.length === 1;
                
                return (
                  <TableRow key={index}>
                    <TableCell className="text-slate-500 text-sm">{index + 1}</TableCell>
                    <TableCell>
                      {universityName}
                      <span className="text-xs text-foreground/70 ml-1">({universityCode})</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        ref={isLast ? lastTrashRef : undefined}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveUniversity(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {selectedUniversities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-slate-500">
                    Nincs hozzáadott egyetem
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {showWarning && (
        <div className="flex items-center gap-2 p-3 rounded-md border border-amber-300 bg-amber-50 text-amber-800 text-sm animate-in fade-in slide-in-from-bottom-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <p>Legalább egy egyetemet kötelező megadni!</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={onClose}
          className="mt-4"
        >
          Mégsem
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="mt-4 bg-theme hover:bg-theme/80"
          disabled={selectedUniversities.length === 0 || updateUniversitiesMutation.isPending}
        >
          Mentés
        </Button>
      </div>
    </div>
  );
};

export default UniversityForm;
