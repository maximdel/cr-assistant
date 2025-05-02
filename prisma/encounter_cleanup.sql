DELETE FROM Encounter
WHERE rowid NOT IN (
  SELECT MIN(rowid)
  FROM Encounter
  GROUP BY opponentId, playedAt
);

SELECT opponentId, playedAt, COUNT(*) AS cnt
FROM Encounter
GROUP BY opponentId, playedAt
HAVING cnt > 1;
