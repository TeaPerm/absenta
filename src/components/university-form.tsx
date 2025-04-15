import { useState } from 'react';
import axios from 'axios';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { API_URL } from '@/lib/constants';
import { useAuthStore } from '@/hooks/useAuth';
import { Trash2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const UniversityForm = () => {
  const user = useUser();
  const token = useAuthStore((state) => state.token);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(user?.university || []);
  const [newUniversity, setNewUniversity] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.put(`${API_URL}/auth/user/university`, {
        universities: selectedUniversities,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Egyetemek sikeresen frissítve!');
    } catch (error) {
      console.error('Error updating universities:', error);
      toast.error('Hiba történt az egyetemek frissítése során.');
    }
  };

  const handleAddUniversity = () => {
    if (newUniversity && !selectedUniversities.includes(newUniversity)) {
      const updatedUniversities = [...selectedUniversities, newUniversity];
      setSelectedUniversities(updatedUniversities);
      setNewUniversity('');
    }
  };

  const handleRemoveUniversity = (index: number) => {
    const updatedUniversities = selectedUniversities.filter((_, i) => i !== index);
    setSelectedUniversities(updatedUniversities);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold mb-4">Egyetemek kezelése</h1>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-3 items-end">
          <div>
            <label htmlFor="new-university" className="block text-sm font-medium mb-1">Új egyetem neve</label>
            <Input
              id="new-university"
              value={newUniversity}
              onChange={(e) => setNewUniversity(e.target.value)}
              placeholder="Egyetem neve"
              className="w-full"
            />
          </div>
          <Button 
            type="button"
            onClick={handleAddUniversity}
            disabled={!newUniversity}
            className="mt-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
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
              {selectedUniversities.map((university, index) => (
                <TableRow key={index}>
                  <TableCell className="text-slate-500 text-sm">{index + 1}</TableCell>
                  <TableCell>{university}</TableCell>
                  <TableCell>
                    <Button
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
              ))}
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

      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={handleSubmit} className="mt-4">
          Mentés
        </Button>
      </div>
    </div>
  );
};

export default UniversityForm;
