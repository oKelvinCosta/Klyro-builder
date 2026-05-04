import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { Alert } from './ui/alert';

interface QuestionRadioProps {
  enunciation: string | React.ReactNode;
  options: { text: string | React.ReactNode; value: string }[];
  correctAnswer: string; // apenas uma resposta correta
  successMessage?: string | React.ReactNode;
  errorMessage?: string | React.ReactNode;
}

type FormData = {
  answer: string;
};

export default function QuestionRadio({
  enunciation,
  options,
  correctAnswer,
  successMessage = '🎉 Muito bem, você acertou!',
  errorMessage = '😵 Ops! Tente novamente.',
}: QuestionRadioProps) {
  const form = useForm<FormData>({
    defaultValues: {
      answer: '',
    },
  });

  const selectedAnswer = form.watch('answer'); // eslint-disable-line react-hooks/incompatible-library
  const isCorrect = selectedAnswer === correctAnswer;

  function radioVisualFeedback(value: string) {
    const isSelected = selectedAnswer === value;
    const isRight = value === correctAnswer;

    if (!isSelected) return 'inline-flex w-fit items-center gap-2 p-1 pl-2 rounded-md';

    return cn(
      'inline-flex w-fit items-center gap-2 p-2 rounded-md transition-colors pr-5',
      isRight
        ? 'border-success border dark:border-green-900/20'
        : 'border-destructive border dark:border-red-900/20'
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-2">
        <h4 className="text-lg font-medium">{enunciation}</h4>

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col gap-2"
                >
                  {options.map((option) => (
                    <label key={option.value} className={radioVisualFeedback(option.value)}>
                      <RadioGroupItem value={option.value} tabIndex={0} />
                      <span className="cursor-pointer text-sm font-normal">{option.text}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {selectedAnswer && (
          <Alert variant={isCorrect ? 'success' : 'destructive'} className="text-left">
            {isCorrect ? successMessage : errorMessage}
          </Alert>
        )}
      </form>
    </Form>
  );
}
