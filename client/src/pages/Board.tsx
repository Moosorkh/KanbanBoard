import { useEffect, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";

import { retrieveTickets, deleteTicket } from "../api/ticketAPI";
import ErrorPage from "./ErrorPage";
import Swimlane from "../components/Swimlane";
import { TicketData } from "../interfaces/TicketData";
import { ApiMessage } from "../interfaces/ApiMessage";

import auth from "../utils/auth";

const boardStates = ["Todo", "In Progress", "Done"];

type SortField = "name" | "createdAt" | "assignedUser";
type SortOrder = "asc" | "desc";

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isLoading, setIsLoading] = useState(false);

  const checkLogin = () => {
    if (auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const data = await retrieveTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to retrieve tickets:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIndvTicket = async (ticketId: number): Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const filterTickets = (ticketsToFilter: TicketData[]) => {
    if (!searchTerm.trim()) return ticketsToFilter;

    const searchLower = searchTerm.toLowerCase();
    return ticketsToFilter.filter(
      (ticket) =>
        ticket.name.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.assignedUser?.username?.toLowerCase().includes(searchLower)
    );
  };

  const sortTickets = (ticketsToSort: TicketData[]) => {
    return [...ticketsToSort].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "assignedUser":
          const userA = a.assignedUser?.username ?? "";
          const userB = b.assignedUser?.username ?? "";
          comparison = userA.localeCompare(userB);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  };

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (loginCheck) {
      fetchTickets();
    }
  }, [loginCheck]);

  if (error) {
    return <ErrorPage />;
  }

  const processTickets = (status: string) => {
    const statusFiltered = tickets.filter((ticket) => ticket.status === status);
    const searched = filterTickets(statusFiltered);
    return sortTickets(searched);
  };

  return (
    <>
      {!loginCheck ? (
        <div className="login-notice">
          <h1>Login to create & view tickets</h1>
        </div>
      ) : (
        <div className="board">
          <div className="board-header">
            <button type="button" id="create-ticket-link">
              <Link to="/create">New Ticket</Link>
            </button>
            <div className="board-controls">
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="sort-select"
              >
                <option value="createdAt">Created Date</option>
                <option value="name">Name</option>
                <option value="assignedUser">Assigned To</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder((order) => (order === "asc" ? "desc" : "asc"))
                }
                className="sort-order-btn"
                title={`Sort ${
                  sortOrder === "asc" ? "Ascending" : "Descending"
                }`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="loading">Loading tickets...</div>
          ) : (
            <div className="board-display">
              {boardStates.map((status) => (
                <Swimlane
                  title={status}
                  key={status}
                  tickets={processTickets(status)}
                  deleteTicket={deleteIndvTicket}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Board;
