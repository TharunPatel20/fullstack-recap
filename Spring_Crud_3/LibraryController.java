package com.wecp.library.controller;

import com.wecp.library.controller.exception.UserNotSubscribedException;
import com.wecp.library.domain.Issue;
import com.wecp.library.domain.User;
import com.wecp.library.repository.IssueRepository;
import com.wecp.library.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**

REST controller for managing library system process
*/
@RestController
@RequestMapping("/api/v1")
public class LibraryController {

@Autowired
private UserRepository userRepo;

@Autowired
private IssueRepository issueRepo;

/**

{@code POST /issue-book} : Create a new issue.

@param issue the issue to create.

@return the {@link ResponseEntity} with status {@code 200 (OK)} and with body

the issue, or throw {@link UserNotSubscribedException} if user is not subscribed.
*/
@PostMapping("/issue-book")
public ResponseEntity<Issue> issueBook(@RequestBody Issue issue) {
Optional<User> userOpt = userRepo.findById(issue.getUser().getId());
if (userOpt.isPresent()) {
User user = userOpt.get();
if (Boolean.TRUE.equals(user.getSubscribed())) {
Issue savedIssue = issueRepo.save(issue);
return ResponseEntity.ok(savedIssue);
} else {
throw new UserNotSubscribedException("User subscription has expired");
}
} else {
return ResponseEntity.noContent().build();
}
}

/**

{@code POST /user} : Create a new user.

@param user the user to create.

@return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the new user
*/
@PostMapping("/user")
public ResponseEntity<User> createUser(@RequestBody User user) {
User savedUser = userRepo.save(user);
return ResponseEntity.ok(savedUser);
}

/**

{@code GET /renew-user-subscription/:id} : Set user subscription to true

@param id the id of the user to renew subscription.

@return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated user
*/
@GetMapping("/renew-user-subscription/{id}")
public ResponseEntity<User> renewUserSubscription(@PathVariable Long id) {
Optional<User> userOpt = userRepo.findById(id);
if (userOpt.isPresent()) {
User user = userOpt.get();
user.setSubscribed(true);
userRepo.save(user);
return ResponseEntity.ok(user);
} else {
return ResponseEntity.noContent().build();
}
}
}
