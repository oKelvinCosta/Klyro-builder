/**
 * "Tamanho" dropdown: headings (H1–H6) and paragraph sizes (base / lg / sm).
 */
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TEXT_SIZES } from './constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TextSizeSelectProps = { editor: any };

export function TextSizeSelect({ editor }: TextSizeSelectProps) {
  return (
    <Select
      onValueChange={(value) => {
        const style = TEXT_SIZES.find((s) => s.value === value);
        // console.log(style);
        if (value === 'p-base') {
          editor.chain().focus().setParagraph().unsetMark('textStyle').run();
        } else if (style?.fontSize) {
          editor
            .chain()
            .focus()
            .setParagraph()
            .setMark('textStyle', { fontSize: style.fontSize })
            .run();
        } else {
          const level = Number(value) as 1 | 2 | 3 | 4 | 5 | 6;
          if (!editor.isActive('heading', { level })) {
            editor.chain().focus().toggleHeading({ level }).unsetMark('textStyle').run();
          } else {
            editor.chain().focus().run();
          }
        }
      }}
    >
      <SelectTrigger className="h-7 w-[130px] text-xs">
        <SelectValue placeholder="Tamanho" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {TEXT_SIZES.map((style) => (
            <SelectItem key={style.value} value={style.value} className="text-xs">
              {style.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
