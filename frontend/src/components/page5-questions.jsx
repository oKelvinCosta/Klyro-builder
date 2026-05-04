'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ArrowDownOnSquareIcon, ExclamationCircleIcon, EyeIcon } from '@heroicons/react/16/solid';
import { Alert, AlertDescription, AlertTitle } from '@shared/components/ui/alert';
import { Button } from '@shared/components/ui/button';
import { Form } from '@shared/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/ui/tabs';
import { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import RadioSection from './RadioSection';

// Schema de validação
const radioFieldSchema = z
  .string({
    required_error: 'Selecione uma opção.',
  })
  .refine((value) => value && value.includes('/'), { message: 'Selecione uma opção.' });

const FormSchema = z.object({
  capacidade_1: radioFieldSchema,
  capacidade_2: radioFieldSchema,
  capacidade_3: radioFieldSchema,
  inspiracao_1: radioFieldSchema,
  inspiracao_2: radioFieldSchema,
  inspiracao_3: radioFieldSchema,
  competencia_1: radioFieldSchema,
  competencia_2: radioFieldSchema,
  competencia_3: radioFieldSchema,
  valores_1: radioFieldSchema,
  valores_2: radioFieldSchema,
  valores_3: radioFieldSchema,
});

export default function RadioGroupShadcn() {
  const [formError, setFormError] = useState('');
  const [totalSum, setTotalSum] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      capacidade_1: '',
      capacidade_2: '',
      capacidade_3: '',
      inspiracao_1: '',
      inspiracao_2: '',
      inspiracao_3: '',
      competencia_1: '',
      competencia_2: '',
      competencia_3: '',
      valores_1: '',
      valores_2: '',
      valores_3: '',
    },
  });

  const questionsCapacidade = [
    {
      label: 'O candidato demonstra habilidades de organização e planejamento?',
      formSchema: 'capacidade_1',
      questions: [
        {
          title: 'Sim, ele mantém tudo sob controle, define metas claras e cumpre prazos.',
          value: 'capacidade_1_1/1',
        },
        {
          title: 'Às vezes, ele se perde nas tarefas e no cronograma.',
          value: 'capacidade_1_2/0',
        },
        {
          title:
            'Não, ele tem dificuldades para manter o controle e às vezes não consegue cumprir prazos.',
          value: 'capacidade_1_3/0',
        },
      ],
    },
    {
      label: 'Ele consegue gerenciar uma equipe diversa e manter todos focados no objetivo?',
      formSchema: 'capacidade_2',
      questions: [
        {
          title: 'Sim, ele sabe delegar responsabilidades e manter todos engajados.',
          value: 'capacidade_2_1/1',
        },
        {
          title: 'Ele tenta, mas tem dificuldades para manter todos motivados.',
          value: 'capacidade_2_2/0',
        },
        {
          title: 'Não, ele tem dificuldade em gerir o grupo e em motivar os membros.',
          value: 'capacidade_2_3/0',
        },
      ],
    },
    {
      label:
        'O candidato possui experiência ou interesse em trabalhar com grupos de jovens e liderá-los?',
      formSchema: 'capacidade_3',
      questions: [
        {
          title: 'Sim, ele já tem experiência em liderança de jovens ou grupos.',
          value: 'capacidade_3_1/1',
        },
        {
          title: 'Ele tem algum interesse, mas pouca experiência.',
          value: 'capacidade_3_2/0',
        },
        {
          title: 'Não, ele nunca trabalhou com grupos de jovens ou em contextos educativos.',
          value: 'capacidade_3_3/0',
        },
      ],
    },
  ];
  const questionsInspiracao = [
    {
      label: 'O candidato é uma pessoa que inspira os outros e estimula a aprendizagem?',
      formSchema: 'inspiracao_1',
      questions: [
        {
          title: 'Sim, ele mantém tudo sob controle, define metas claras e cumpre prazos.',
          value: 'inspiracao_1_1/1',
        },
        {
          title: 'Às vezes, ele se perde nas tarefas e no cronograma.',
          value: 'inspiracao_1_2/0',
        },
        {
          title: 'Não, ele tem dificuldades em planejar e organizar as atividades.',
          value: 'inspiracao_1_3/0',
        },
      ],
    },
    {
      label: 'Ele possui uma atitude positiva diante dos desafios, buscando soluções criativas?',
      formSchema: 'inspiracao_2',
      questions: [
        {
          title: 'Sim, ele é muito criativo e sempre encontra formas de solucionar problemas.',
          value: 'inspiracao_2_1/1',
        },
        {
          title: 'Ele tenta, mas às vezes fica desmotivado diante dos obstáculos.',
          value: 'inspiracao_2_2/0',
        },
        {
          title: 'Não, ele tende a desanimar e não busca soluções criativas.',
          value: 'inspiracao_2_3/0',
        },
      ],
    },
    {
      label: 'Ele demonstra paixão e entusiasmo pelas áreas de robótica e tecnologia?',
      formSchema: 'inspiracao_3',
      questions: [
        {
          title:
            'Sim, ele tem um grande entusiasmo por tecnologia e compartilha isso com os alunos.',
          value: 'inspiracao_3_1/1',
        },
        {
          title: 'Ele tem algum interesse, mas não demonstra muita paixão.',
          value: 'inspiracao_3_2/0',
        },
        {
          title: 'Não, ele não demonstra entusiasmo ou interesse genuíno',
          value: 'inspiracao_3_3/0',
        },
      ],
    },
  ];
  const questionsCompetencia = [
    {
      label: 'O candidato é empático e sabe lidar com as dificuldades emocionais dos alunos?',
      formSchema: 'competencia_1',
      questions: [
        {
          title: 'Sim, ele é sempre atencioso e compreende as necessidades emocionais dos alunos.',
          value: 'competencia_1_1/1',
        },
        {
          title: 'Ele tenta ser empático, mas tem dificuldades em lidar com conflitos emocionais.',
          value: 'competencia_1_2/0',
        },
        {
          title: 'Não, ele tem dificuldade em se conectar com os alunos emocionalmente.',
          value: 'competencia_1_3/0',
        },
      ],
    },
    {
      label: 'Ele demonstra paciência e perseverança quando enfrenta obstáculos?',
      formSchema: 'competencia_2',
      questions: [
        {
          title: 'Sim, ele mantém a calma e continua trabalhando até alcançar os resultados.',
          value: 'competencia_2_1/1',
        },
        {
          title: 'Ele fica frustrado, mas tenta continuar.',
          value: 'competencia_2_2/0',
        },
        {
          title: 'Não, ele se irrita facilmente quando as coisas não saem como o esperado.',
          value: 'competencia_2_3/0',
        },
      ],
    },
    {
      label: 'O candidato é capaz de gerenciar conflitos dentro da equipe de maneira construtiva?',
      formSchema: 'competencia_3',
      questions: [
        {
          title: 'Sim, ele sabe mediar discussões e manter a harmonia dentro do grupo.',
          value: 'competencia_3_1/1',
        },
        {
          title: 'Ele tenta, mas tem dificuldades em resolver disputas.',
          value: 'competencia_3_2/0',
        },
        {
          title:
            'Não, ele tem dificuldade em lidar com conflitos e tensões entre os membros da equipe.',
          value: 'competencia_3_3/0',
        },
      ],
    },
  ];
  const questionsValores = [
    {
      label:
        'O candidato demonstra comprometimento com os valores fundamentais da FIRST®, como respeito e cooperação?',
      formSchema: 'valores_1',
      questions: [
        {
          title:
            'Sim, ele pratica esses valores todos os dias e é um exemplo para os estudantes e professores.',
          value: 'valores_1_1/1',
        },
        {
          title: 'Ele tenta aplicar, mas às vezes se esquece de reforçar esses valores.',
          value: 'valores_1_2/0',
        },
        {
          title: 'Não, ele não tem muita preocupação com esses valores em sua abordagem.',
          value: 'valores_1_3/0',
        },
      ],
    },
    {
      label: 'Ele incentiva a competição amigável e a colaboração entre as equipes?',
      formSchema: 'valores_2',
      questions: [
        {
          title: 'Sim, ele promove sempre o espírito de cooperação, mesmo com equipes concorrentes',
          value: 'valores_2_1/1',
        },
        {
          title: 'Ele tenta, mas, em alguns momentos, acaba gerando competitividade excessiva.',
          value: 'valores_2_2/0',
        },
        {
          title: 'Não, ele tem dificuldade em equilibrar competição e colaboração.',
          value: 'valores_2_3/0',
        },
      ],
    },
    {
      label:
        'O candidato acredita na importância da educação STEAM (ciência, tecnologia, engenharia, artes e matemática) e a promove?',
      formSchema: 'valores_3',
      questions: [
        {
          title: 'Sim, ele entende o valor das áreas de STEAM e sempre as integra nas atividades.',
          value: 'valores_3_1/1',
        },
        {
          title: 'Ele tem algum entendimento, mas nem sempre integra STEAM de forma eficaz.',
          value: 'valores_3_2/0',
        },
        {
          title: 'Não, ele não tem muita compreensão ou interesse em promover STEAM.',
          value: 'valores_3_3/0',
        },
      ],
    },
  ];

  // Função para processar o envio do formulário
  const onSubmit = (data) => {
    //Transform to arry, so I can use map
    let toArray = Object.entries(data);

    let numbers = toArray.map((item) => {
      // Destructuring
      const [, value] = item;
      return Number(value.split('/')[1]);
    });

    // Sum items
    let sum = numbers.reduce((acc, curr) => acc + curr);
    setTotalSum(sum);
    setFormError('');
    setIsFormSubmitted(true);
  };

  const onError = () => {
    setFormError('Você esqueceu de responder alguma questão');
  };

  // let myObject = {
  //   capacidade_1: "capacidade_1_1/1",
  //   capacidade_2: "capacidade_2_1/1",
  //   capacidade_3: "capacidade_3_1/1",
  //   inspiracao_1: "inspiracao_1_1/1",
  //   inspiracao_2: "inspiracao_2_1/1",
  //   inspiracao_3: "inspiracao_3_1/1",
  //   competencia_1: "competencia_1_1/1",
  //   competencia_2: "competencia_2_1/1",
  //   competencia_3: "competencia_3_1/1",
  //   valores_1: "valores_1_1/1",
  //   valores_2: "valores_2_1/1",
  //   valores_3: "valores_3_1/1",
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="w-full space-y-6">
        <div id="um" className="mt-8">
          <Fade direction="up" cascade>
            <h4 className="mb-6 text-green-400">1. Capacidade de gestão e organização</h4>
          </Fade>

          <RadioSection questions={questionsCapacidade} form={form} />
        </div>

        <div id="dois" className="mt-8">
          <Fade direction="up" cascade>
            <h4 className="mb-6 text-yellow-400">2. Inspiração e motivação</h4>
          </Fade>
          <RadioSection questions={questionsInspiracao} form={form} />
        </div>

        <div id="tres" className="mt-8">
          <Fade direction="up" cascade>
            <h4 className="mb-6 text-red-500">3. Competências socioemocionais</h4>
          </Fade>
          <RadioSection questions={questionsCompetencia} form={form} />
        </div>

        <div id="quatro" className="mt-8">
          <Fade direction="up" cascade>
            <h4 className="mb-6 text-blue-500">4. Adesão aos valores da FIRST®</h4>
          </Fade>
          <RadioSection questions={questionsValores} form={form} />
        </div>

        {/* Feedback negative */}
        {formError && (
          <Alert variant="destructive" className="mx-auto max-w-[580px]">
            <ExclamationCircleIcon className="h-4 w-4" />
            <AlertTitle>Ops!</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8 flex justify-center gap-4">
          <Button type="submit" variant="muted">
            <EyeIcon />
            Ver resposta
          </Button>
          <Button asChild variant="muted">
            <a
              href="./resources/Questionario_FLL_FORMACAO_A.pdf"
              download="Questionario_FLL_FORMACAO_A.pdf"
              className="flex items-center gap-2"
            >
              <ArrowDownOnSquareIcon />
              Download
            </a>
          </Button>
        </div>

        {/* Feedback positive */}
        {!formError && isFormSubmitted && <Answer totalSum={totalSum} />}
      </form>
    </Form>
  );
}

function Answer({ totalSum }) {
  let showFirst = 'first';

  if (totalSum >= 10) {
    showFirst = 'first';
  } else if (totalSum > 3 && totalSum < 10) {
    showFirst = 'second';
  } else {
    showFirst = 'third';
  }

  return (
    <div className="mx-auto max-w-[580px] rounded-md border border-gray-800 p-6">
      <div className={`gap-0 rounded-md bg-gray-800 p-3 text-center`}>Resultado e reflexão</div>
      <p className="text-center">Total de respostas “Sim”: {totalSum}</p>
      <Tabs defaultValue={showFirst}>
        <TabsList className="justify-center overflow-x-auto">
          <TabsTrigger value="third">3-5</TabsTrigger>
          <TabsTrigger value="second">6-9</TabsTrigger>
          <TabsTrigger value="first">10-12</TabsTrigger>
        </TabsList>
        <TabsContent value="third">
          <p>
            O candidato pode não estar completamente preparado para liderar uma equipe do FLLC,
            especialmente em termos de competências socioemocionais e valores. Recomendamos procurar
            outras opções ou fornecer mais treinamento e acompanhamento.
          </p>
        </TabsContent>
        <TabsContent value="second">
          <p>
            O candidato possui algumas qualidades importantes, mas pode precisar de mais capacitação
            ou desenvolvimento em áreas chave. Considere treiná-lo ou orientá-lo mais intensamente
            nas áreas de liderança e gestão de equipe.
          </p>
        </TabsContent>

        <TabsContent value="first">
          <p>
            O candidato está alinhado com as qualidades necessárias para ser um bom técnico da
            FIRST® LEGO® League Challenge! Ele possui as habilidades de gestão, inspiração e
            empatia necessárias para guiar os alunos com sucesso.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
