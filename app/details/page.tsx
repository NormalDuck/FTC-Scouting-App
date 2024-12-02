"use client"; // This ensures the component runs on the client side

import {
  Accordion,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffectOnce } from "react-use";

import { COMPETITION } from "@/constants/competition";
import { AllianceColor } from "@/constants/enums";
import {
  Match,
  TeamProperties,
  TeamPropertiesCollection,
} from "@/types/team-properties";
import { CalculatePoints } from "@/utils/calculate-points";

export default function MyPage() {
  const searchParams = useSearchParams();
  const team: string | null = searchParams.get("team");
  const [teamProperties, setTeamProperties] = useState<TeamProperties>();
  const [matches, setMatches] = useState<Array<Match>>();
  const [comments, setComments] = useState<string | undefined>();

  useEffectOnce(() => {
    fetch("api/fetch-team", {
      method: "POST",
      body: JSON.stringify([Number(team)]),
    }).then((_response) => {
      _response.json().then((response: TeamPropertiesCollection) => {
        setTeamProperties(response[0]);
        fetch("api/fetch-matches", {
          method: "POST",
          body: JSON.stringify({
            collection: COMPETITION,
            matches: response[0].matches,
          } as {
            collection: string;
            matches: Array<number>;
          }),
        }).then((_matches) => {
          _matches.json().then((matches) => {
            setMatches(matches);
          });
        });
      });
    });
  });

  return (
    <>
      <Modal
        onClose={() => setComments(undefined)}
        show={comments !== undefined}
      >
        <ModalHeader>Comments</ModalHeader>
        <ModalBody>
          {comments === "" ? "No comments left by scouters" : comments}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setComments(undefined)}>Exit</Button>
        </ModalFooter>
      </Modal>
      {teamProperties ? (
        <>
          <p className="text-center">{`${teamProperties.team}: ${teamProperties.name}`}</p>
          <p className="text-center">{`👑 Rank: ${teamProperties.rank === -1 ? "undefined" : teamProperties.rank}`}</p>

          <Accordion>
            {teamProperties.matches.map((matchNumber) => {
              return (
                <Accordion.Panel key={matchNumber}>
                  <Accordion.Title>{` ${matches?.find((match) => match.match === matchNumber)?.teams.find((team) => team.team === teamProperties.team)?.color === AllianceColor.Red ? "🔴" : "🔵"} Match: ${matchNumber}`}</Accordion.Title>
                  <Accordion.Content>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHead>
                          <TableHeadCell>Team</TableHeadCell>
                          <TableHeadCell>Alliance</TableHeadCell>
                          <TableHeadCell>Specimen</TableHeadCell>
                          <TableHeadCell>Basket</TableHeadCell>
                          <TableHeadCell>Climb</TableHeadCell>
                          <TableHeadCell>Total</TableHeadCell>
                        </TableHead>
                        <TableBody className="divide-y">
                          {matches
                            ?.find((match) => match.match === matchNumber)
                            ?.teams.map((data) => (
                              <>
                                <TableRow
                                  onClick={() => setComments(data.comments)}
                                >
                                  <TableCell className="text-xs">
                                    {`${data.team}: ${data.name}`}
                                  </TableCell>
                                  <TableCell>
                                    {data.color === AllianceColor.Red
                                      ? "🔴"
                                      : "🔵"}
                                  </TableCell>
                                  <TableCell>
                                    {CalculatePoints(data).specimen}
                                  </TableCell>
                                  <TableCell>
                                    {CalculatePoints(data).basket}
                                  </TableCell>
                                  <TableCell>
                                    {CalculatePoints(data).climb}
                                  </TableCell>
                                  <TableCell>
                                    {CalculatePoints(data).total}
                                  </TableCell>
                                </TableRow>
                              </>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              );
            })}
          </Accordion>
        </>
      ) : undefined}
    </>
  );
}
