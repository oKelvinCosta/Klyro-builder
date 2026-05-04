import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from './ui/alert';

interface QuestionCheckboxProps {
  enunciation: string | React.ReactNode;
  options: { text: string | React.ReactNode; value: string }[];
  correctAnswers: string[]; // múltiplas respostas corretas
  successMessage?: string | React.ReactNode;
  errorMessage?: string | React.ReactNode;
  incompleteMessage?: string | React.ReactNode;
  className?: string;
}

type FormData = {
  answers: string[];
};

export default function QuestionCheckbox({
  enunciation,
  options,
  correctAnswers,
  successMessage = '🎉 Muito bem, você acertou!',
  errorMessage = '😵 Ops! Tente novamente.',
  incompleteMessage = '🤔 Sua resposta está incompleta! Você marcou algumas opções corretas, mas ainda faltam outras.',
  className,
}: QuestionCheckboxProps) {
  const form = useForm<FormData>({
    defaultValues: {
      answers: [],
    },
  });

  const selectedAnswers = form.watch('answers'); // eslint-disable-line react-hooks/incompatible-library

  // Enhanced feedback state logic with incomplete message support
  const feedbackState = (() => {
    if (selectedAnswers.length === 0) {
      return null;
    }

    // Check if any selected answers are incorrect
    const hasIncorrectSelection = selectedAnswers.some(
      (answer) => !correctAnswers.includes(answer)
    );
    if (hasIncorrectSelection) {
      return { status: 'error', message: errorMessage };
    }

    // Check if all correct answers have been selected
    const selectedSet = new Set(selectedAnswers);
    const correctSet = new Set(correctAnswers);
    const isComplete =
      selectedSet.size === correctSet.size && [...selectedSet].every((val) => correctSet.has(val));

    if (isComplete) {
      return { status: 'success', message: successMessage };
    }

    // Return incomplete state when some correct answers are selected but not all
    return { status: 'incomplete', message: incompleteMessage };
  })();

  function checkboxVisualFeedback(value: string) {
    const isSelected = selectedAnswers.includes(value);
    const isCorrectOption = correctAnswers.includes(value);

    if (!isSelected) return 'flex items-center space-x-3 space-y-0 p-2 rounded-md';

    return cn(
      'flex items-center space-x-3 space-y-0 p-2 rounded-md transition-colors border',
      isCorrectOption
        ? 'border-success dark:border-lime-400'
        : 'border-destructive dark:border-orange-500'
    );
  }

  return (
    <Form {...form}>
      <form className={cn('space-y-4', className)}>
        <h4 className="text-foreground text-lg font-medium">{enunciation}</h4>

        <FormField
          control={form.control}
          name="answers"
          render={() => (
            <FormItem className="space-y-1">
              {options.map((option) => (
                <FormField
                  key={option.value}
                  control={form.control}
                  name="answers"
                  render={({ field }) => {
                    return (
                      <FormItem className={checkboxVisualFeedback(option.value)}>
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, option.value])
                                : field.onChange(
                                    field.value?.filter((value) => value !== option.value)
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-foreground cursor-pointer text-sm font-normal">
                          {option.text}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </FormItem>
          )}
        />

        {/* Enhanced Feedback Block with incomplete state support */}
        {feedbackState && (
          <Alert
            variant={feedbackState.status === 'error' ? 'destructive' : 'success'}
            className={cn('text-left', {
              'dark:bg-yellow-900/ border-yellow-400 bg-yellow-100 text-yellow-800 dark:border-yellow-700/50 dark:text-orange-500':
                feedbackState.status === 'incomplete',
            })}
          >
            {feedbackState.message}
          </Alert>
        )}
      </form>
    </Form>
  );
}
