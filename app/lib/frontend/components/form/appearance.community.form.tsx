import { Palette, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Community } from "@/app/lib/backend/domain/entity/community.entity";

interface Props {
  community: Community;
}

export function AppearanceCommunityForm(props: Props) {
  const { community } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Aparência
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Avatar da Comunidade</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={"/placeholder.svg"} />
              <AvatarFallback>{community.name[0]}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Alterar
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Banner da Comunidade</Label>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Clique para fazer upload
              </p>
            </div>
          </div>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="theme">Tema</Label>
          <Select defaultValue="Padrão">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Padrão</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="blue">Azul</SelectItem>
              <SelectItem value="green">Verde</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </CardContent>
    </Card>
  );
}
